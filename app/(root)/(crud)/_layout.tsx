import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="add-debt" options={{ presentation: "modal" }} />
            <Stack.Screen name="[debt-id]" />
        </Stack>
    );
}
