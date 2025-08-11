import { Text, View } from "react-native";

export const PaymentCard = ({ item }: { item: PaymentProps }) => {
    return (
        <View className="py-2 border-b border-gray-300 flex flex-row justify-between items-center">
            <View>
                <Text className="text-black-200 font-rubik-medium text-lg">{item.amount} جنية</Text>
                <Text className="text-gray-500 font-rubik-medium text-sm">{item.date}</Text>
            </View>
            <View className="py-1.5 px-2.5 rounded-md bg-primary-300">
                <Text className="text-white font-rubik-medium text-sm">مدفوع</Text>
            </View>
        </View>
    );
};
