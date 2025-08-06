import { Text, View } from "react-native";
import { BarChart } from "./bar-chart";

export const Widget = ({ title, count, icon, style, countStyle }: WidgetProps) => {
    return (
        <View className={`p-6 bg-white shadow-md rounded-lg flex items-end gap-2 ${style}`}>
            <Text className="text-lg text-gray-500 font-rubik-medium">{title}</Text>
            <Text className={`text-xl font-rubik-bold ${countStyle}`}>
                {icon} {count}
            </Text>
        </View>
    );
};

export const WidgetWithBar = ({ title, count, totale, style, countStyle }: WidgetProps) => {
    const progress = ((parseFloat(count) / parseFloat(totale || "1")) * 100).toFixed(2);

    return (
        <View className={`p-6 bg-white shadow-md rounded-lg flex items-end gap-5 ${style}`}>
            <Text className="text-lg text-gray-500 font-rubik-medium">{title}</Text>
            <View className="w-full flex items-end gap-3">
                <View className="flex-row items-center gap-2">
                    <Text className={`text-xl font-rubik-medium ${countStyle}`}>{totale} جنيه</Text>
                    <Text className={`text-2xl font-rubik-bold ${countStyle}`}>{count} جنيه /</Text>
                </View>

                {/* Make a progress bar RTL */}
                <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden" style={{ direction: "rtl" }}>
                    <View className={`h-full bg-primary-300 rounded-full`} style={{ width: `${progress}%` as any }} />
                </View>
            </View>
            <BarChart />
        </View>
    );
};
