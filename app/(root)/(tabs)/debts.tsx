import Entypo from "@expo/vector-icons/Entypo";
import { useRouter } from "expo-router";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { personData } from "@/assets/data";
import { DebtCard } from "@/components/cards/debt-card";

export default function Debts() {
    const route = useRouter();

    return (
        <SafeAreaView className="flex-1 px-4 relative">
            <View className="py-9 items-start justify-center flex-row">
                <Text className="text-black-200 font-rubik-bold text-3xl">ديوني</Text>
            </View>

            <TouchableOpacity onPress={() => route.push("/(root)/(crud)/add-debt")} className="absolute bottom-28 right-5 z-10 w-[60px] h-[60px] bg-primary-300 rounded-full items-center justify-center">
                <Entypo name="plus" size={30} color="white" />
            </TouchableOpacity>

            <FlatList style={{ direction: "rtl" }} contentContainerClassName="pb-20 gap-5" data={personData} renderItem={({ item }) => <DebtCard data={item} />} keyExtractor={(item) => item.id.toString()} />
        </SafeAreaView>
    );
}
