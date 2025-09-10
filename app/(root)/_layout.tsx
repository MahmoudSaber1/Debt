import { Redirect, Slot } from "expo-router";

import { useAuth } from "@/lib/global-context";

export default function RootLayout() {
    const { userToken } = useAuth();

    if (!userToken) {
        return <Redirect href={"/"} />;
    }

    return <Slot />;
}
