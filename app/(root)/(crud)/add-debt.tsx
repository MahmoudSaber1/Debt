import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import { useState } from "react";
import { Text, TextInput, ToastAndroid, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AddBtn } from "@/components/buttons";
import { PersonService } from "@/services/personService";

export default function AddDebt() {
    const [data, setData] = useState({
        name: "",
        amount: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleAddDebt = async () => {
        setIsLoading(true);
        try {
            const newDebt = {
                name: data.name,
                totalAmount: parseFloat(data.amount),
                remainingAmount: 0,
                description: "",
                status: "active",
            };
            await PersonService.addPerson(newDebt).then(() => {
                ToastAndroid.show("تمت إضافة الدين بنجاح", ToastAndroid.SHORT);
                router.back();
            });
        } catch (error) {
            console.error("Error adding debt:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 px-4 relative">
            <View className="py-9 items-center justify-between flex-row">
                <Text className="text-black-200 font-rubik-bold text-3xl"></Text>
                <Text className="text-black-200 font-rubik-bold text-3xl">إضافة شخص جديد</Text>
                <Feather onPress={() => router.back()} name="x" size={24} color="black" />
            </View>

            <View className="flex-1 gap-4" style={{ direction: "rtl" }}>
                <View>
                    <Text className="text-black-200 font-rubik-bold text-lg mb-2">اسم المدين</Text>
                    <TextInput className="border border-black-200 py-4 px-2 rounded-md" placeholder="اسم المدين" value={data.name} onChangeText={(text) => setData({ ...data, name: text })} />
                </View>
                <View>
                    <Text className="text-black-200 font-rubik-bold text-lg mb-2">المبلغ</Text>
                    <TextInput className="border border-black-200 py-4 px-2 rounded-md" placeholder="المبلغ: 100 جنيه" value={data.amount} onChangeText={(text) => setData({ ...data, amount: text })} />
                </View>
            </View>

            <AddBtn onPress={() => handleAddDebt()} isLoading={isLoading} title="إضافة الشخص" />
        </SafeAreaView>
    );
}
