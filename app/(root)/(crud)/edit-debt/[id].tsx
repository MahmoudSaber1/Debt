import Feather from "@expo/vector-icons/Feather";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Switch, Text, TextInput, ToastAndroid, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AddBtn } from "@/components/buttons";
import { PersonService } from "@/services/personService";

export default function EditDebt() {
    const { id } = useLocalSearchParams<{ id?: string }>();
    const [data, setData] = useState({
        name: "",
        amount: "",
        remainingAmount: "",
        totalAmount: "",
        status: "active",
    });
    const [isLoading, setIsLoading] = useState(false);

    const getDebtDetails = useCallback(async () => {
        try {
            const debt = await PersonService.getPersonById(parseInt(id!));
            setData({
                name: debt.name,
                remainingAmount: debt.remainingAmount.toString(),
                totalAmount: debt.totalAmount.toString(),
                amount: "",
                status: debt.status,
            });
        } catch (error) {
            console.error("Error fetching debt details:", error);
        }
    }, [id]);
    const handleEditDebt = async () => {
        setIsLoading(true);
        try {
            const updateTotal = parseFloat(data.totalAmount) + parseFloat(data.amount || "0");
            const updateRemaining = parseFloat(data.remainingAmount) + parseFloat(data.amount || "0");

            const newDebt = {
                name: data.name,
                totalAmount: updateTotal,
                remainingAmount: updateRemaining,
                description: "",
                status: data.status,
            };
            await PersonService.updatePerson(parseInt(id!), newDebt).then(() => {
                ToastAndroid.show("تمت تعديل الدين بنجاح", ToastAndroid.SHORT);
                router.back();
            });
        } catch (error) {
            console.error("Error adding debt:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getDebtDetails();
    }, [getDebtDetails]);

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
