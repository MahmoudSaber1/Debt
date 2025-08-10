import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddDebt() {
    return (
        <SafeAreaView className="flex-1 px-4 relative">
            <View className="py-9 items-start justify-center flex-row">
                <Text className="text-black-200 font-rubik-bold text-3xl">إضافة دين</Text>
            </View>
        </SafeAreaView>
    );
}
