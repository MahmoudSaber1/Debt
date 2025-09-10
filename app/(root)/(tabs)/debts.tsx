import Entypo from "@expo/vector-icons/Entypo";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { DebtCard } from "@/components/cards/debt-card";
import { useAuth } from "@/lib/global-context";
import { PersonService } from "@/services/personService";

export default function Debts() {
    const route = useRouter();
    const { signOut } = useAuth();
    const [refreshing, setRefreshing] = useState(false);

    const query = useQuery({
        queryKey: ["debts"],
        queryFn: async () => {
            const response = await PersonService.getAllPeople();
            return response;
        },
    });
    const { data: debts, isPending, refetch } = query;

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    if (isPending) {
        return <ActivityIndicator size="large" color="#fea726" />;
    }

    return (
        <SafeAreaView className="flex-1 px-4 relative">
            <View className="py-9 items-start justify-between flex-row">
                <Text></Text>
                <Text className="text-black-200 font-rubik-bold text-3xl">ديوني</Text>
                <Entypo name="log-out" size={30} color="#fea726" onPress={() => signOut()} />
            </View>

            <TouchableOpacity onPress={() => route.push("/(root)/(crud)/add-debt")} className="absolute bottom-28 right-5 z-10 w-[60px] h-[60px] bg-primary-300 rounded-full items-center justify-center">
                <Entypo name="plus" size={30} color="white" />
            </TouchableOpacity>

            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                <View className="flex-1 flex-col gap-4" style={{ direction: "rtl" }}>
                    {debts.map((item: any) => (
                        <DebtCard key={item.id} data={item} />
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
