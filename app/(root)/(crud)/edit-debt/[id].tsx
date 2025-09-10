import Feather from "@expo/vector-icons/Feather";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Switch, Text, TextInput, ToastAndroid, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AddBtn } from "@/components/buttons";
import { PersonService } from "@/services/personService";

export default function EditDebt() {
    const { id } = useLocalSearchParams<{ id?: string }>();
    const queryClient = useQueryClient();

    const [data, setData] = useState({
        name: "",
        totalAmount: "",
        remainingAmount: "",
        amount: "",
        status: "",
    });

    const getDebt = useQuery({
        queryKey: ["person", id],
        queryFn: async () => {
            const debt = await PersonService.getPersonById(parseInt(id!));
            setData({
                name: debt.name,
                remainingAmount: debt.remainingAmount.toString(),
                totalAmount: debt.totalAmount.toString(),
                amount: "",
                status: debt.status,
            });
            return debt;
        },
    });
    const { isPending } = getDebt;

    const mutationEditDebt = useMutation({
        mutationFn: async () => {
            const updateTotal = parseFloat(data.totalAmount) + parseFloat(data.amount || "0");
            const updateRemaining = parseFloat(data.remainingAmount) + parseFloat(data.amount || "0");
            const updateStatus = updateRemaining === 0 ? "paid" : "active";

            const newDebt = {
                name: data.name,
                totalAmount: updateTotal,
                remainingAmount: updateRemaining,
                description: "",
                status: updateStatus,
            };
            await PersonService.updatePerson(parseInt(id!), newDebt);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["debts"] });
            await queryClient.invalidateQueries({ queryKey: ["debt"] });
            ToastAndroid.show("تمت تعديل الدين بنجاح", ToastAndroid.SHORT);
            router.back();
        },
    });
    const { mutate: handleEditDebt, isPending: isLoading } = mutationEditDebt;

    if (isPending) {
        return <ActivityIndicator size="large" color="#fea726" />;
    }

    return (
        <SafeAreaView className="flex-1 px-4 relative">
            <View className="py-9 items-center justify-between flex-row">
                <Text className="text-black-200 font-rubik-bold text-3xl"></Text>
                <Text className="text-black-200 font-rubik-bold text-3xl">{data.name}</Text>
                <Feather onPress={() => router.back()} name="x" size={24} color="black" />
            </View>

            <View className="flex-1 gap-4" style={{ direction: "rtl" }}>
                <View>
                    <Text className="text-black-200 font-rubik-bold text-lg mb-2">اسم المدين</Text>
                    <TextInput className="border border-black-200 text-black-300 py-4 px-2 rounded-md" placeholder="اسم المدين" value={data.name} onChangeText={(text) => setData({ ...data, name: text })} />
                </View>
                <View>
                    <Text className="text-black-200 font-rubik-bold text-lg mb-2">مبلغ زياده</Text>
                    <TextInput className="border border-black-200 text-black-300 py-4 px-2 rounded-md" placeholder="المبلغ: 100 جنيه" value={data.amount} onChangeText={(text) => setData({ ...data, amount: text })} />
                </View>
                {/* Make a switch for status */}
                <View className="flex-row items-center justify-between">
                    <Text className="text-black-200 font-rubik-bold text-lg mb-2">الحالة</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#fea726" }}
                        thumbColor={data.status === "active" ? "#f5dd4d" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
                        value={data.status === "active"}
                        onValueChange={(value) => setData({ ...data, status: value ? "active" : "paid" })}
                    />
                </View>
            </View>

            <AddBtn onPress={() => handleEditDebt()} isLoading={isLoading} title="تعديل الشخص" />
        </SafeAreaView>
    );
}
