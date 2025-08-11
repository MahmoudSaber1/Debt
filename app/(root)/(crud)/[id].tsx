import AntDesign from "@expo/vector-icons/AntDesign";
import { router, useLocalSearchParams } from "expo-router";
import { FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { personData } from "@/assets/data";
import { AddBtn } from "@/components/buttons";
import { PaymentCard } from "@/components/cards/payment-card";
import { ProgressBar } from "@/components/widget";

export default function DebtDetails() {
    const { id } = useLocalSearchParams<{ id?: string }>();
    if (!id) {
        return (
            <SafeAreaView className="flex-1 px-4">
                <Text className="text-red-500">لا يوجد معرف</Text>
            </SafeAreaView>
        );
    }
    const getCurrentDebt = personData.find((debt) => debt.id === parseInt(id));
    if (!getCurrentDebt) {
        return (
            <SafeAreaView className="flex-1 px-4">
                <Text className="text-red-500">لا يوجد دين بهذا المعرف</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 px-4 relative">
            <View className="py-9 items-center justify-between flex-row">
                <Text></Text>
                <Text className="text-black-200 font-rubik-bold text-3xl">تفاصيل الدين</Text>
                <AntDesign onPress={() => router.back()} name="arrowright" size={24} color="black" />
            </View>

            <View className="flex-1">
                <View className="py-4 flex items-center justify-center">
                    <View className="size-200 bg-primary-100 rounded-full items-center justify-center pb-4">
                        <Image source={{ uri: "https://avatars.githubusercontent.com/u/67934444?v=4" }} className="w-40 h-40 rounded-full" />
                    </View>
                    <View className="gap-2 flex items-center justify-center">
                        <Text className="text-black-200 font-rubik-bold text-3xl">{getCurrentDebt.name}</Text>
                        <View className="items-center justify-center">
                            <Text className="text-black-200 font-rubik-medium text-lg">اجمالي الدين: {getCurrentDebt.totalAmount} جنية</Text>
                            <Text className="text-black-200 font-rubik-bold text-lg">المتبقي: {getCurrentDebt.remainingAmount} جنية</Text>
                        </View>
                    </View>
                </View>

                <View className="my-4 px-4 py-8 gap-2 bg-white rounded-md shadow-sm border border-gray-100">
                    <View className="flex items-center justify-between gap-3 flex-row">
                        <Text className="text-primary-300 font-rubik-medium text-lg">{((getCurrentDebt.remainingAmount / getCurrentDebt.totalAmount) * 100).toFixed(2)}%</Text>
                        <Text className="text-primary-300 font-rubik-bold text-lg">نسبة السداد</Text>
                    </View>
                    <ProgressBar count={getCurrentDebt.remainingAmount.toString()} totale={getCurrentDebt.totalAmount.toString()} />
                </View>

                <View className="flex-1 py-4 gap-2" style={{ direction: "rtl" }}>
                    <Text className="text-black-200 font-rubik-bold text-3xl mb-2">الدفعات</Text>
                    <FlatList contentContainerClassName="gap-2" data={getCurrentDebt.payments} renderItem={({ item }) => <PaymentCard item={item} />} keyExtractor={(item) => item.id.toString()} />
                </View>
            </View>

            <AddBtn onPress={() => router.push(`/add-payment/${id}`)} title="إضافة دفعة جديدة" />
        </SafeAreaView>
    );
}
