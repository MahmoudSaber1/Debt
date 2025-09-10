import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider } from "./global-context";

// Create a client
const queryClient = new QueryClient();

export function QueryProvider({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
    );
}
