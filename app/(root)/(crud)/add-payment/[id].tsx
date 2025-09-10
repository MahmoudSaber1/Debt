import Feather from "@expo/vector-icons/Feather";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Text, TextInput, ToastAndroid, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AddBtn } from "@/components/buttons";
import { PaymentService } from "@/services/paymentService";
import { PersonService } from "@/services/personService";

export default function AddPayment() {
    const { id } = useLocalSearchParams<{ id?: string }>();
    const queryClient = useQueryClient();

    const [data, setData] = useState({
        amount: "",
        date: new Date(),
    });

    const mutationAddPayment = useMutation({
        mutationFn: async () => {
            const payments = await PersonService.getPersonById(parseInt(id!));
            const isAmountBiggerThanRemaining = parseFloat(data.amount) > parseFloat(payments.remainingAmount);
            if (isAmountBiggerThanRemaining) {
                throw new Error(`المبلغ المدفوع يجب ان يكون اقل من المبلغ المتبقي ${payments.remainingAmount}`);
            }

            const newDebt = {
                personId: id ? parseInt(id) : 0,
                amount: parseFloat(data.amount),
                paymentDate: data.date.toISOString(),
                notes: "",
            };
            await PaymentService.addPayment(newDebt);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["debts"] });
            await queryClient.invalidateQueries({ queryKey: ["debt"] });
            ToastAndroid.show("تمت إضافة الدفعة بنجاح", ToastAndroid.SHORT);
            router.back();
        },
        onError: (error: any) => {
            ToastAndroid.show(error.message, ToastAndroid.SHORT);
        },
    });
    const { mutate: handleAddPayment, isPending: isLoading } = mutationAddPayment;

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
