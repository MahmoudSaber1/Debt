import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Widget, WidgetWithBarSpring } from "@/components/widget";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function Home() {
    return (
        <SafeAreaView className="flex-1 px-4">
            <View className="py-9 items-start justify-center flex-row">
                <Text className="text-black-200 font-rubik-bold text-3xl">الأحصائيات</Text>
            </View>

            {/* Widgets */}
            <View className="flex-1 gap-4">
                <Widget title="إجمالي الأشخاص" count={"10"} style="w-full" />
                <View className="flex-row justify-between gap-4">
                    <Widget title="المبلغ المتبقي" count={"500"} icon={<FontAwesome6 name="arrow-trend-down" size={15} color="#fda4af" />} style="w-1/2" countStyle="text-rose-300" />
                    <Widget title="المبلغ المسدد" count={"1000"} icon={<FontAwesome6 name="arrow-trend-up" size={15} color="#6ee7b7" />} style="flex-1" countStyle="text-emerald-300" />
                </View>
                <WidgetWithBarSpring title="تطور السداد (هذا العام)" totale={"5000"} count="1250" style="w-full" />
            </View>
        </SafeAreaView>
    );
}
