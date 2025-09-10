import AntDesign from "@expo/vector-icons/AntDesign";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

export const AddBtn = ({ onPress, title, isLoading }: { onPress: () => void; title: string; isLoading?: boolean }) => {
    return (
        <TouchableOpacity onPress={onPress} className="bg-primary-300 py-4 px-2 gap-2 rounded-md flex-row-reverse items-center justify-center mb-4">
            {isLoading ? (
                <ActivityIndicator size="small" color="white" />
            ) : (
                <>
                    <AntDesign name="plus" size={24} color="white" />
                    <Text className="text-white font-rubik-bold text-xl">{title}</Text>
                </>
            )}
        </TouchableOpacity>
    );
};

export const EditBtn = ({ onPress }: { onPress: () => void }) => {
    return (
        <TouchableOpacity onPress={onPress} className="bg-primary-300 py-2 px-3 gap-2 rounded-md flex-row-reverse items-center justify-center">
            <AntDesign name="edit" size={20} color="white" />
        </TouchableOpacity>
    );
};

export const DeleteBtn = ({ onPress, loading }: { onPress: () => void; loading: boolean }) => {
    return (
        <TouchableOpacity onPress={onPress} className="bg-red-500 py-1 px-1.5 rounded-md flex-row-reverse items-center justify-center">
            {loading ? <ActivityIndicator size={16} color="white" /> : <AntDesign name="delete" size={16} color="white" />}
        </TouchableOpacity>
    );
};

export const RetryBtn = ({ onPress }: { onPress: () => void }) => {
    return (
        <TouchableOpacity onPress={onPress} className="bg-primary-300 py-2 px-3 gap-2 rounded-md flex-row-reverse items-center justify-center">
            <AntDesign name="reload1" size={20} color="white" />
        </TouchableOpacity>
    );
};
