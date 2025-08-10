import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { CountUp } from "use-count-up";

import { BarChart } from "./bar-chart";

export const Widget = ({ title, count, icon, style, countStyle }: WidgetProps) => {
    return (
        <View className={`p-6 bg-white shadow-md rounded-lg flex items-end gap-2 ${style}`}>
            <Text className="text-lg text-gray-500 font-rubik-medium">{title}</Text>
            <Text className={`text-xl font-rubik-bold ${countStyle}`}>
                {icon} <CountUp isCounting end={parseFloat(count)} duration={1.5} />
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

            {/* <BarChart /> */}
            <BarChart />
        </View>
    );
};

// Alternative version with spring animation and bounce effect
export const WidgetWithBarSpring = ({ title, count, totale, style, countStyle }: WidgetProps) => {
    return (
        <View className={`p-6 bg-white shadow-md rounded-lg flex items-end gap-5 ${style}`}>
            <Text className="text-lg text-gray-500 font-rubik-medium">{title}</Text>

            <View className="w-full flex items-end gap-3">
                <View className="flex-row items-center gap-2">
                    <Text className={`text-xl font-rubik-medium ${countStyle}`}>
                        <CountUp isCounting end={parseFloat(totale!)} duration={1.5} />
                        جنيه
                    </Text>
                    <Text className={`text-2xl font-rubik-bold ${countStyle}`}>
                        <CountUp isCounting end={parseFloat(count)} duration={1.5} />
                        جنيه /
                    </Text>
                </View>

                <ProgressBar count={count} totale={totale!} />
            </View>

            <BarChart />
        </View>
    );
};

export const ProgressBar = ({ count, totale }: { count: string; totale: string }) => {
    const progress = (parseFloat(count) / parseFloat(totale || "1")) * 100;

    const progressWidth = useSharedValue(0);
    const bounceScale = useSharedValue(1);

    useEffect(() => {
        // Spring animation for smoother, more natural movement
        progressWidth.value = withSpring(progress, {
            damping: 20,
            stiffness: 90,
            mass: 1,
        });

        // Bounce effect when progress updates
        bounceScale.value = withSpring(
            1.05,
            {
                damping: 15,
                stiffness: 200,
            },
            () => {
                bounceScale.value = withSpring(1, {
                    damping: 15,
                    stiffness: 200,
                });
            }
        );
    }, [count, totale, progress, bounceScale, progressWidth]);

    const progressBarAnimatedStyle = useAnimatedStyle(() => ({
        width: `${progressWidth.value}%`,
        transform: [{ scaleY: bounceScale.value }],
    }));
    return (
        <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden" style={{ direction: "rtl" }}>
            <Animated.View className="h-full bg-primary-300 rounded-full" style={progressBarAnimatedStyle} />
        </View>
    );
};
