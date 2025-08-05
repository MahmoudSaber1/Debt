import { useEffect } from "react";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

export const CircleAnimation = () => {
    // Create shared values for the animation
    const circle1Scale = useSharedValue(0.8);
    const circle2Scale = useSharedValue(0.6);
    const circle3Scale = useSharedValue(0.4);
    const circle1Opacity = useSharedValue(0.8);
    const circle2Opacity = useSharedValue(0.6);
    const circle3Opacity = useSharedValue(0.4);

    // Start animations when component mounts
    useEffect(() => {
        // Animate the first circle
        circle1Scale.value = withRepeat(
            withTiming(1.2, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
            -1, // Infinite repetitions
            true // Reverse
        );
        circle1Opacity.value = withRepeat(withTiming(0.2, { duration: 1500, easing: Easing.inOut(Easing.ease) }), -1, true);

        // Animate the second circle with a slight delay
        circle2Scale.value = withRepeat(withTiming(1.2, { duration: 2000, easing: Easing.inOut(Easing.ease) }), -1, true);
        circle2Opacity.value = withRepeat(withTiming(0.2, { duration: 2000, easing: Easing.inOut(Easing.ease) }), -1, true);

        // Animate the third circle with more delay
        circle3Scale.value = withRepeat(withTiming(1.2, { duration: 2500, easing: Easing.inOut(Easing.ease) }), -1, true);
        circle3Opacity.value = withRepeat(withTiming(0.2, { duration: 2500, easing: Easing.inOut(Easing.ease) }), -1, true);
    }, [circle1Opacity, circle1Scale, circle2Opacity, circle2Scale, circle3Opacity, circle3Scale]);

    // Create animated styles for each circle
    const animatedCircle1Style = useAnimatedStyle(() => {
        return {
            transform: [{ scale: circle1Scale.value }],
            opacity: circle1Opacity.value,
        };
    });

    const animatedCircle2Style = useAnimatedStyle(() => {
        return {
            transform: [{ scale: circle2Scale.value }],
            opacity: circle2Opacity.value,
        };
    });

    const animatedCircle3Style = useAnimatedStyle(() => {
        return {
            transform: [{ scale: circle3Scale.value }],
            opacity: circle3Opacity.value,
        };
    });

    return (
        <>
            <Animated.View
                style={[
                    {
                        position: "absolute",
                        borderWidth: 2,
                        borderColor: "#fea726",
                        width: 200,
                        height: 200,
                        borderRadius: "100%",
                    },
                    animatedCircle1Style,
                ]}
            />
            <Animated.View
                style={[
                    {
                        position: "absolute",
                        borderWidth: 2,
                        borderColor: "#fea726",
                        width: 400,
                        height: 400,
                        borderRadius: "100%",
                    },
                    animatedCircle2Style,
                ]}
            />
            <Animated.View
                style={[
                    {
                        position: "absolute",
                        borderWidth: 2,
                        borderColor: "#fea726",
                        width: 600,
                        height: 600,
                        borderRadius: "100%",
                    },
                    animatedCircle3Style,
                ]}
            />
        </>
    );
};
