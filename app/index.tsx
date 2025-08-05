import * as LocalAuthentication from "expo-local-authentication";
import { useCallback, useEffect } from "react";
import { Alert, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CircleAnimation } from "@/components/circle-animation";
import { useAuthStore } from "@/store";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Index() {
    const { setBiometricType, setIsAuthenticated } = useAuthStore();

    // فحص دعم البصمة على الجهاز
    const checkBiometricSupport = useCallback(async () => {
        try {
            // التحقق من دعم الأجهزة للبصمة
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            if (!hasHardware) {
                Alert.alert("خطأ", "هذا الجهاز لا يدعم المصادقة البيومترية");
                return;
            }

            // التحقق من وجود بصمات مسجلة
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();
            if (!isEnrolled) {
                Alert.alert("تنبيه", "لا توجد بصمات مسجلة على هذا الجهاز");
                return;
            }

            // الحصول على أنواع المصادقة المتاحة
            const availableTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

            if (availableTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
                setBiometricType("بصمة الإصبع");
            } else if (availableTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
                setBiometricType("التعرف على الوجه");
            } else if (availableTypes.includes(LocalAuthentication.AuthenticationType.IRIS)) {
                setBiometricType("مسح القزحية");
            }
        } catch (error) {
            console.error("خطأ في فحص دعم البصمة:", error);
        }
    }, [setBiometricType]);

    // تشغيل مصادقة البصمة
    const authenticateUser = async () => {
        try {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: "ضع إصبعك على مستشعر البصمة",
                cancelLabel: "إلغاء",
                fallbackLabel: "استخدم كلمة المرور",
                disableDeviceFallback: false, // السماح بالعودة لكلمة مرور الجهاز
            });

            if (result.success) {
                setIsAuthenticated(true);
                Alert.alert("نجح!", "تم التحقق من البصمة بنجاح");
            } else {
                setIsAuthenticated(false);

                // التعامل مع أسباب الفشل المختلفة
                if (result.error === "user_cancel") {
                    Alert.alert("ملغي", "تم إلغاء المصادقة من قبل المستخدم");
                } else if (result.error === "user_fallback") {
                    Alert.alert("تنبيه", "تم اختيار كلمة المرور بدلاً من البصمة");
                } else if (result.error === "not_available") {
                    Alert.alert("خطأ", "المصادقة البيومترية غير متاحة");
                } else if (result.error === "not_enrolled") {
                    Alert.alert("خطأ", `لا توجد بصمات مسجلة على هذا الجهاز`);
                } else {
                    Alert.alert("خطأ", "فشل في التحقق من البصمة");
                }
            }
        } catch (error) {
            console.error("خطأ في المصادقة:", error);
            Alert.alert("خطأ", "حدث خطأ غير متوقع");
        }
    };

    useEffect(() => {
        checkBiometricSupport();
    }, [checkBiometricSupport]);

    return (
        <SafeAreaView className="h-full bg-white">
            <View className="py-10 px-5 flex items-center justify-center flex-col gap-2">
                <Text className="text-3xl font-rubik-bold">ضع بصمتك</Text>
                <Text className="text-sm font-rubik">ضع بصمتك لكي تستطيع الدخول</Text>
            </View>
            <View className="flex-1 justify-center items-center relative">
                <View className="bg-primary-300 p-5 rounded-full">
                    <Ionicons name="finger-print" size={60} color="white" />
                </View>

                {/* Animated circles */}
                <CircleAnimation />
            </View>
        </SafeAreaView>
    );
}
