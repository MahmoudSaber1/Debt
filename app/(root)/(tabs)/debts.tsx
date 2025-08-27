import Entypo from "@expo/vector-icons/Entypo";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { RefreshControl, ScrollView, Text, ToastAndroid, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { DebtCard } from "@/components/cards/debt-card";
import { PersonService } from "@/services/personService";

export default function Debts() {
    const route = useRouter();
    const [debts, setDebts] = useState<PersonProps[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);

    const getDebts = async () => {
        try {
            const response = await PersonService.getAllPeople();
            setDebts(response);
        } catch (error) {
            console.error("Error fetching debts:", error);
        }
    };

    const handleDelete = async (id: number) => {
        setLoading(true);
        try {
            await PersonService.deletePerson(id).then(async () => {
                ToastAndroid.show("تم حذف الدين بنجاح", ToastAndroid.SHORT);
                await getDebts();
            });
        } catch (error) {
            console.error("Error deleting debt:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getDebts();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await getDebts();
        setRefreshing(false);
    };

    return (
        <SafeAreaView className="flex-1 px-4 relative">
            <View className="py-9 items-start justify-center flex-row">
                <Text className="text-black-200 font-rubik-bold text-3xl">ديوني</Text>
            </View>

            <TouchableOpacity onPress={() => route.push("/(root)/(crud)/add-debt")} className="absolute bottom-28 right-5 z-10 w-[60px] h-[60px] bg-primary-300 rounded-full items-center justify-center">
                <Entypo name="plus" size={30} color="white" />
            </TouchableOpacity>

            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                <View className="flex-1 flex-col gap-4" style={{ direction: "rtl" }}>
                    {debts.map((item) => (
                        <DebtCard key={item.id} data={item} onDelete={handleDelete} loading={loading} />
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
