import { useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Widget, WidgetWithBarSpring } from "@/components/widget";
import { PersonService } from "@/services/personService";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
    const [refreshing, setRefreshing] = useState(false);

    const query = useQuery({
        queryKey: ["statistics"],
        queryFn: async () => {
            const response = await PersonService.getStatistics();
            return response;
        },
    });
    const { data: statistics, isPending, refetch } = query;

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    if (isPending) {
        return <ActivityIndicator size="large" color="#fea726" />;
    }

    return (
        <SafeAreaView className="flex-1 px-4">
            <View className="fixed py-9 items-start justify-center flex-row">
                <Text className="text-black-200 font-rubik-bold text-3xl">الأحصائيات</Text>
            </View>

            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 70 }} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                {/* Widgets */}
                <View className="flex-1 gap-4">
                    <Widget title="إجمالي الأشخاص" count={statistics?.totalPeople} style="w-full" />
                    <Widget title="إجمالي المبلغ" count={statistics?.totalDebt} style="w-full" />
                    <View className="flex-row justify-between gap-4">
                        <Widget title="المبلغ المتبقي" count={statistics?.totalRemaining} icon={<FontAwesome6 name="arrow-trend-down" size={15} color="#fda4af" />} style="w-1/2" countStyle="text-rose-300" />
                        <Widget title="المبلغ المسدد" count={statistics?.totalPaid} icon={<FontAwesome6 name="arrow-trend-up" size={15} color="#6ee7b7" />} style="flex-1" countStyle="text-emerald-300" />
                    </View>
                    <WidgetWithBarSpring title="تطور السداد (هذا العام)" totale={statistics?.totalDebt} paid={statistics?.totalPaid} count={statistics?.totalRemaining} style="w-full" />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
