import { View } from "react-native";

import { barData } from "@/assets/data";

export const BarChart = () => {
    return (
        <View className="w-full h-64 overflow-hidden">
            <View className="flex-1 flex-row items-end justify-between gap-2 overflow-auto">
                {barData.map((item, index) => (
                    <View key={index} className="flex-1 flex-col items-center pt-4">
                        <View className={`w-full bg-primary-300 rounded-md`} style={{ height: `${item.value * 2}%` }} />
                        {/* <Text className="text-sm font-rubik-medium text-gray-500">{item.label}</Text> */}
                    </View>
                ))}
            </View>
        </View>
    );
};
