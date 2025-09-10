import AntDesign from "@expo/vector-icons/AntDesign";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, Image, RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AddBtn, EditBtn } from "@/components/buttons";
import { PaymentCard } from "@/components/cards/payment-card";
import { EmptyState } from "@/components/empty";
import { ProgressBar } from "@/components/widget";
import { PaymentService } from "@/services/paymentService";
import { PersonService } from "@/services/personService";

export default function DebtDetails() {
    const { id } = useLocalSearchParams<{ id?: string }>();
    const [refreshing, setRefreshing] = React.useState(false);

    const query = useQuery({
        queryKey: ["debt"],
        queryFn: async () => {
            const [payments, personData] = await Promise.all([PaymentService.getPaymentsByPersonId(parseInt(id!)), PersonService.getPersonById(parseInt(id!))]);
            const personDataWithPayments = {
                ...personData,
                payments: payments,
            };
            return personDataWithPayments;
        },
    });
    const { data: personData, isPending, refetch } = query;

    if (!id) {
        return (
            <SafeAreaView className="flex-1 px-4">
                <Text className="text-red-500">لا يوجد معرف</Text>
            </SafeAreaView>
        );
    }

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
            <View className="py-9 items-center justify-between flex-row">
                <EditBtn onPress={() => router.push(`/edit-debt/${id}`)} />
                <Text className="text-black-200 font-rubik-bold text-3xl">تفاصيل الدين</Text>
                <AntDesign onPress={() => router.back()} name="arrowright" size={24} color="black" />
            </View>

            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} showsVerticalScrollIndicator={false} className="flex-1">
                <View className="flex-1">
                    <View className="py-4 flex items-center justify-center">
                        <View className="size-200 bg-primary-100 rounded-full items-center justify-center pb-4">
                            <Image source={{ uri: "https://avatars.githubusercontent.com/u/67934444?v=4" }} className="w-40 h-40 rounded-full" />
                        </View>
                        <View className="gap-2 flex items-center justify-center">
                            <Text className="text-black-200 font-rubik-bold text-3xl">{personData?.name}</Text>
                            <View className="items-center justify-center">
                                <Text className="text-black-200 font-rubik-medium text-lg">اجمالي الدين: {personData?.totalAmount} جنية</Text>
                                <Text className="text-black-200 font-rubik-bold text-lg">المتبقي: {personData?.remainingAmount} جنية</Text>
                            </View>
                        </View>
                    </View>

                    <View className="my-4 px-4 py-8 gap-2 bg-white rounded-md shadow-sm border border-gray-100">
                        <View className="flex items-center justify-between gap-3 flex-row">
                            <Text className="text-primary-300 font-rubik-medium text-lg">{(((personData?.totalAmount - personData?.remainingAmount) / personData?.totalAmount) * 100).toFixed(2)}%</Text>
                            <Text className="text-primary-300 font-rubik-bold text-lg">نسبة السداد</Text>
                        </View>
                        <ProgressBar count={personData?.remainingAmount.toString()} totale={personData?.totalAmount.toString()} />
                    </View>

                    <View className="flex-1 py-4 gap-2" style={{ direction: "rtl" }}>
                        <Text className="text-black-200 font-rubik-bold text-3xl mb-2">الدفعات</Text>
                        <ScrollView className="flex-1 flex-col gap-2">{personData?.payments.length > 0 ? personData?.payments.map((payment: any) => <PaymentCard key={payment.id} item={payment} />) : <EmptyState />}</ScrollView>
                    </View>
                </View>
            </ScrollView>

            {personData?.status === "paid" ? null : <AddBtn onPress={() => router.push(`/add-payment/${id}`)} title="إضافة دفعة جديدة" />}
        </SafeAreaView>
    );
}
