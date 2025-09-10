// AuthContext.js - Debug Version
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useReducer } from "react";

// إنشاء Context
const AuthContext = createContext("");

// الحالات المختلفة للـ Authentication
const authReducer = (state: any, action: any) => {
    console.log("🔄 Auth Reducer called with action:", action.type);

    switch (action.type) {
        case "RESTORE_TOKEN":
            console.log("✅ Restoring token:", action.token ? "Token exists" : "No token");
            return {
                ...state,
                userToken: action.token,
                isLoading: false,
            };
        case "SIGN_IN":
            console.log("✅ Signing in with token:", action.token);
            return {
                ...state,
                isSignedIn: true,
                userToken: action.token,
                isLoading: false,
            };
        case "SIGN_OUT":
            console.log("✅ Signing out");
            return {
                ...state,
                isSignedIn: false,
                userToken: null,
                isLoading: false,
            };
        case "SET_LOADING":
            console.log("⏳ Setting loading:", action.isLoading);
            return {
                ...state,
                isLoading: action.isLoading,
            };
        default:
            console.log("⚠️ Unknown action type:", action.type);
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

    console.log("🏠 AuthProvider rendered with state:", {
        isLoading: state.isLoading,
        isSignedIn: state.isSignedIn,
        hasToken: !!state.userToken,
    });

    // استرجاع البيانات عند بدء التطبيق
    useEffect(() => {
        console.log("🚀 Bootstrap started");
        const bootstrapAsync = async () => {
            let userToken;

            try {
                userToken = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
                console.log("💾 Retrieved token from storage:", userToken ? "Token exists" : "No token");
            } catch (e) {
                console.error("خطأ في استرجاع بيانات المستخدم:", e);
            }

            dispatch({ type: "RESTORE_TOKEN", token: userToken });
        };

        bootstrapAsync();
    }, []);

    // دالة تسجيل الدخول
    const signIn = useCallback(async (token: string) => {
        console.log("🔐 signIn called with token:", token);
        try {
            dispatch({ type: "SET_LOADING", isLoading: true });

            await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
            console.log("💾 Token saved to storage");

            dispatch({ type: "SIGN_IN", token });
        } catch (error) {
            console.error("خطأ في حفظ بيانات تسجيل الدخول:", error);
            dispatch({ type: "SET_LOADING", isLoading: false });
        }
    }, []);

    // دالة تسجيل الخروج
    const signOut = useCallback(async () => {
        console.log("🚪 signOut called");
        try {
            dispatch({ type: "SET_LOADING", isLoading: true });

            await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN]);
            console.log("🗑️ Token removed from storage");

            dispatch({ type: "SIGN_OUT" });
        } catch (error) {
            console.error("خطأ في حذف بيانات المستخدم:", error);
            dispatch({ type: "SET_LOADING", isLoading: false });
        }
    }, []);

    // دالة للتحقق من صحة التوكن
    const validateToken = useCallback(async () => {
        console.log("🔍 validateToken called");
        try {
            if (!state.userToken) return false;

            return true;
        } catch (error) {
            console.error("خطأ في التحقق من صحة التوكن:", error);
            return false;
        }
    }, [state.userToken]);

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
