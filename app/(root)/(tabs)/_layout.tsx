import AntDesign from "@expo/vector-icons/AntDesign";
import { Tabs } from "expo-router";
import { Text, View } from "react-native";

const TabIcon = ({ focused, icon, title }: { focused: boolean; icon: "linechart" | "solution1"; title: string }) => (
    <View className="flex-1 flex flex-col items-center">
        <AntDesign name={`${icon}`} color={focused ? "#00c950" : "#666876"} size={20} />
        <Text className={`${focused ? "text-primary-300 font-rubik-medium" : "text-black-200 font-rubik"} text-xs w-full text-center mt-1`}>{title}</Text>
    </View>
);

const TabsLayout = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: "white",
                    position: "absolute",
                    borderTopColor: "#0061FF1A",
                    borderTopWidth: 1,
                    minHeight: 70,
                },
            }}
        >
            <Tabs.Screen
                name="debts"
                options={{
                    title: "القوائم",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={"solution1"} title="القوائم" />,
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    title: "الأحصائيات",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={"linechart"} title="الأحصائيات" />,
                }}
            />
        </Tabs>
    );
};

export default TabsLayout;
