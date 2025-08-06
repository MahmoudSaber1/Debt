import { Redirect, Slot } from "expo-router";

import { useAuthStore } from "@/store";

export default function RootLayout() {
    const { isAuthenticated } = useAuthStore();

    if (!isAuthenticated) {
        return <Redirect href={"/"} />;
    }

    return <Slot />;
}
