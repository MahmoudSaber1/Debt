// AuthContext.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useReducer } from "react";

// إنشاء Context
const AuthContext = createContext("");

// الحالات المختلفة للـ Authentication
const authReducer = (state: any, action: any) => {
    switch (action.type) {
        case "RESTORE_TOKEN":
            return {
                ...state,
                userToken: action.token,
                isLoading: false,
            };
        case "SIGN_IN":
            return {
                ...state,
                isSignedIn: true,
                userToken: action.token,
                isLoading: false,
            };
        case "SIGN_OUT":
            return {
                ...state,
                isSignedIn: false,
                userToken: null,
                isLoading: false,
            };
        default:
            return state;
    }
};

// الحالة الأولية
const initialState = {
    isLoading: true,
    isSignedIn: false,
    userToken: null,
};

// مفاتيح AsyncStorage
const STORAGE_KEYS = {
    TOKEN: "@user_token",
};

export const AuthProvider = ({ children }: PropsChildren) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // استرجاع البيانات عند بدء التطبيق
    useEffect(() => {
        const bootstrapAsync = async () => {
            let userToken;

            try {
                // محاولة استرجاع التوكن وبيانات المستخدم
                userToken = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
            } catch (e) {
                console.error("خطأ في استرجاع بيانات المستخدم:", e);
            }

            // إرسال البيانات المسترجعة إلى الـ reducer
            dispatch({ type: "RESTORE_TOKEN", token: userToken });
        };

        bootstrapAsync();
    }, []);

    // دالة تسجيل الدخول
    const signIn = async (token: string) => {
        try {
            dispatch({ type: "SET_LOADING", isLoading: true });

            // حفظ التوكن وبيانات المستخدم في AsyncStorage
            await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);

            // تحديث الحالة
            dispatch({ type: "SIGN_IN", token });
        } catch (error) {
            console.error("خطأ في حفظ بيانات تسجيل الدخول:", error);
            dispatch({ type: "SET_LOADING", isLoading: false });
        }
    };

    // دالة تسجيل الخروج
    const signOut = async () => {
        try {
            dispatch({ type: "SET_LOADING", isLoading: true });

            // حذف البيانات من AsyncStorage
            await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN]);

            // تحديث الحالة
            dispatch({ type: "SIGN_OUT" });
        } catch (error) {
            console.error("خطأ في حذف بيانات المستخدم:", error);
            dispatch({ type: "SET_LOADING", isLoading: false });
        }
    };

    // دالة للتحقق من صحة التوكن
    const validateToken = async () => {
        try {
            if (!state.userToken) return false;

            // هنا يمكنك إضافة منطق التحقق من صحة التوكن مع الخادم
            // مثال:
            // const response = await fetch('/api/validate-token', {
            //   headers: { Authorization: `Bearer ${state.userToken}` }
            // });
            // return response.ok;

            return true; // مؤقت - استبدل بالتحقق الفعلي
        } catch (error) {
            console.error("خطأ في التحقق من صحة التوكن:", error);
            return false;
        }
    };

    // القيم والدوال المتاحة للمكونات
    const authContextValue = {
        ...state,
        signIn,
        signOut,
        validateToken,
    };

    return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};

type AuthContextType = {
    isSignedIn: boolean;
    userToken: string | null;
    isLoading: boolean;
    signIn: (token: string) => Promise<void>;
    signOut: () => Promise<void>;
    validateToken: () => Promise<boolean>;
};

// Hook مخصص لاستخدام Auth Context
export const useAuth = (): AuthContextType => {
    const context: any = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth يجب أن يكون داخل AuthProvider");
    }
    return context;
};

export default AuthContext;
