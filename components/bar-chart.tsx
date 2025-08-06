import { View } from "react-native";

export const BarChart = () => {
    const barData = [
        { value: 30, label: "Jan" },
        { value: 20, label: "Feb" },
        { value: 15, label: "Mar" },
        { value: 37, label: "Apr" },
        { value: 25, label: "May" },
        { value: 40, label: "Jun" },
        { value: 35, label: "Jul" },
        { value: 30, label: "Aug" },
        { value: 20, label: "Sep" },
        { value: 15, label: "Oct" },
        { value: 10, label: "Nov" },
        { value: 50, label: "Dec" },
    ];
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
