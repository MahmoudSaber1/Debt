import AntDesign from "@expo/vector-icons/AntDesign";
import { Text, TouchableOpacity } from "react-native";

export const AddBtn = ({ onPress, title }: { onPress: () => void; title: string }) => {
    return (
        <TouchableOpacity onPress={onPress} className="bg-primary-300 py-4 px-2 gap-2 rounded-md flex-row-reverse items-center justify-center mb-4">
            <AntDesign name="plus" size={24} color="white" />
            <Text className="text-white font-rubik-bold text-xl">{title}</Text>
        </TouchableOpacity>
    );
};
