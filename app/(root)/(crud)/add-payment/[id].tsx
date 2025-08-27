import Feather from "@expo/vector-icons/Feather";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, ToastAndroid, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AddBtn } from "@/components/buttons";
import { PaymentService } from "@/services/paymentService";

export default function AddPayment() {
    const { id } = useLocalSearchParams<{ id?: string }>();

    const [data, setData] = useState({
        amount: "",
        date: new Date(),
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleAddPayment = async () => {
        setIsLoading(true);
        try {
            const newDebt = {
                personId: id ? parseInt(id) : 0,
                amount: parseFloat(data.amount),
                paymentDate: data.date.toISOString(),
                notes: "",
            };
            await PaymentService.addPayment(newDebt).then(() => {
                ToastAndroid.show("تمت إضافة الدفعة بنجاح", ToastAndroid.SHORT);
                router.back();
            });
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "حدث خطأ أثناء إضافة الدفعة. يرجى المحاولة مرة أخرى.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 px-4 relative">
            <View className="py-9 items-center justify-between flex-row">
                <Text className="text-black-200 font-rubik-bold text-3xl"></Text>
                <Text className="text-black-200 font-rubik-bold text-3xl">إضافة دفعة جديدة</Text>
                <Feather onPress={() => router.back()} name="x" size={24} color="black" />
            </View>

            <View className="flex-1 gap-4" style={{ direction: "rtl" }}>
                <View>
                    <Text className="text-black-200 font-rubik-bold text-lg mb-2">مبلغ الدفعه</Text>
                    <TextInput className="border border-black-200 py-4 px-2 rounded-md" placeholder="مبلغ الدفعه" value={data.amount} onChangeText={(text) => setData({ ...data, amount: text })} />
                </View>
            </View>

            <AddBtn onPress={handleAddPayment} isLoading={isLoading} title="إضافة دفعة جديدة" />
        </SafeAreaView>
    );
}
