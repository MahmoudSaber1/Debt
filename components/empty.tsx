import { Text, View } from "react-native";

export const EmptyState = () => {
    return (
        <View className="flex-1 items-center justify-center">
            <Text className="text-gray-500">لا توجد بيانات لعرضها</Text>
        </View>
    );
};
