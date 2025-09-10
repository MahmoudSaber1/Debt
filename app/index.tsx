import * as LocalAuthentication from "expo-local-authentication";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CircleAnimation } from "@/components/circle-animation";
import { useAuth } from "@/lib/global-context";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Index() {
    const redirect = useRouter();
    const { signIn, userToken, isLoading } = useAuth();

    // استخدام ref لتتبع ما إذا كانت المصادقة البيومترية قد تم محاولتها
    const biometricAttempted = useRef(false);
    const [authenticationInProgress, setAuthenticationInProgress] = useState(false);

    const handleBiometricAuth = useCallback(async () => {
        // منع المحاولات المتعددة
        if (biometricAttempted.current || authenticationInProgress) {
            return;
        }

        biometricAttempted.current = true;
        setAuthenticationInProgress(true);

        try {
            // فحص الدعم
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            if (!hasHardware) {
                Alert.alert("خطأ", "هذا الجهاز لا يدعم المصادقة البيومترية");
                return;
            }

            const isEnrolled = await LocalAuthentication.isEnrolledAsync();
            if (!isEnrolled) {
                Alert.alert("تنبيه", "لا توجد بصمات مسجلة على هذا الجهاز");
                return;
            }

            // تحديد نوع البصمة
            const availableTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
            let currentBiometricType = "البصمة";
            if (availableTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
                currentBiometricType = "بصمة الإصبع";
            } else if (availableTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
                currentBiometricType = "التعرف على الوجه";
            }

            // بدء المصادقة
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: currentBiometricType === "بصمة الإصبع" ? "ضع إصبعك على مستشعر البصمة" : "ضع وجهك امام الكاميرا",
                cancelLabel: "إلغاء",
                fallbackLabel: "استخدم كلمة المرور",
                disableDeviceFallback: false,
            });

            if (result.success) {
                await signIn("isAuthenticated");
                // سيتم التوجيه تلقائياً من خلال useEffect منفصل
            } else if (result.error === "user_cancel") {
                // المستخدم ألغى العملية - يمكن إعطاؤه فرصة أخرى
                biometricAttempted.current = false;
            }
        } catch (error) {
            console.error("خطأ في المصادقة:", error);
            // إعادة تعيين في حالة الخطأ للسماح بالمحاولة مرة أخرى
            biometricAttempted.current = false;
        } finally {
            setAuthenticationInProgress(false);
        }
    }, [authenticationInProgress, signIn]);

    // تأثير منفصل للتحقق من المصادقة والتوجيه
    useEffect(() => {
        if (!isLoading && userToken) {
            redirect.push("/(root)/(tabs)");
        }
    }, [userToken, isLoading, redirect]);

    // تأثير منفصل لبدء المصادقة البيومترية
    useEffect(() => {
        if (!isLoading && !userToken && !biometricAttempted.current) {
            // تأخير صغير للتأكد من أن الواجهة جاهزة
            const timer = setTimeout(() => {
                handleBiometricAuth();
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [isLoading, userToken, handleBiometricAuth]);

    // إعادة تعيين عند إلغاء تحميل المكون
    useEffect(() => {
        return () => {
            biometricAttempted.current = false;
        };
    }, []);

    return (
        <SafeAreaView className="h-full bg-white relative">
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

            {/* Verison number */}
            <View className="absolute bottom-5 left-5">
                <Text className="text-gray-500 text-xl">V1.4.0</Text>
            </View>
        </SafeAreaView>
    );
}
