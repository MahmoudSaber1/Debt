import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Text, ToastAndroid, TouchableOpacity, View } from "react-native";

import { PersonService } from "@/services/personService";
import { DeleteBtn } from "../buttons";
import { ProgressBar } from "../widget";

export const DebtCard = ({ data }: DebtCardProps) => {
    const route = useRouter();
    const queryClient = useQueryClient();

    const mutationDelete = useMutation({
        mutationFn: async (id: number) => {
            await PersonService.deletePerson(id);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["debts"] });
            await queryClient.invalidateQueries({ queryKey: ["statistics"] });
            ToastAndroid.show("تم حذف الدين بنجاح", ToastAndroid.SHORT);
        },
    });
    const { mutate: deleteDebt, isPending: loading } = mutationDelete;

    return (
        <TouchableOpacity onPress={() => route.push(`/(root)/(crud)/${data.id}`)} className="p-4 bg-white shadow-md rounded-lg">
            <View className="flex-row items-center justify-between">
                <Text className="text-lg font-rubik-bold">{data.name}</Text>
                <View className="flex-row items-center gap-2">
                    <View className="py-1 px-2 rounded-md bg-primary-300">
                        <Text className="text-white font-rubik-medium text-xs">{data.status === "paid" ? "مدفوع" : "غير مدفوع"}</Text>
                    </View>
                    <DeleteBtn onPress={() => deleteDebt(data.id)} loading={loading} />
                </View>
            </View>
            <View className="flex-row items-center justify-between">
                <Text className="text-sm font-rubik-medium text-gray-500 mt-1">الإجمالي: {data.totalAmount} جنيه</Text>
                <Text className="text-sm font-rubik-medium text-slate-400">المتبقي: {data.remainingAmount} جنيه</Text>
            </View>
            <View className="mt-2">
                <ProgressBar count={data.remainingAmount.toString()} totale={data.totalAmount.toString()} />
            </View>
        </TouchableOpacity>
    );
};
