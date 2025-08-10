import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

import { ProgressBar } from "../widget";

export const DebtCard = ({ data }: DebtCardProps) => {
    const route = useRouter();

    return (
        <TouchableOpacity onPress={() => route.push(`/(root)/(crud)/${data.id}`)} className="p-4 bg-white shadow-md rounded-lg">
            <View className="flex-row items-center justify-between">
                <Text className="text-lg font-rubik-bold">{data.name}</Text>
                <Text className="text-lg font-rubik-medium text-slate-400">المتبقي: {data.remainingAmount} جنيه</Text>
            </View>
            <Text className="text-sm font-rubik-medium text-gray-500 mt-1">الإجمالي: {data.totalAmount} جنيه</Text>
            <View className="mt-2">
                <ProgressBar count={data.remainingAmount.toString()} totale={data.totalAmount.toString()} />
            </View>
        </TouchableOpacity>
    );
};
