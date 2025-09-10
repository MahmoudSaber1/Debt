import * as LocalAuthentication from "expo-local-authentication";
import { useRouter } from "expo-router";
import { useCallback, useEffect } from "react";
import { Alert, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CircleAnimation } from "@/components/circle-animation";
import { useAuth } from "@/lib/global-context";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Index() {
    const redirect = useRouter();
    const { signIn, userToken, isLoading } = useAuth();

    const handleBiometricAuth = useCallback(async () => {
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
                signIn("isAuthenticated");
                redirect.push("/(root)/(tabs)");
            } else {
                // handle errors...
            }
        } catch (error) {
            console.error("خطأ في المصادقة:", error);
        }
    }, [signIn, redirect]);

    useEffect(() => {
        if (isLoading) {
            return;
        }

        if (userToken) {
            redirect.push("/(root)/(tabs)");
        } else {
            handleBiometricAuth();
        }
    }, [handleBiometricAuth, userToken, redirect, isLoading]);

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
