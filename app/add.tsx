import { useRouter } from "expo-router";
import { View, StyleSheet, Text, TextInput } from "react-native";
import { FAB } from "react-native-paper";

const Add = () => {
    const router = useRouter();
    return (
        <View>
            <FAB label="task" onPress={() => router.push("./Add_tasks")}/>            
            <FAB label="reset" onPress={() => router.push("./resetDb")}/>            
        </View>
    );
};

export default Add;