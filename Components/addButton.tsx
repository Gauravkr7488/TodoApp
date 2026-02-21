import { FAB } from "react-native-paper";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  onPress: () => void;
  onLongPress?: () => void;
};
const AddButton = ({ onPress, onLongPress }: Props) => {
  return (
    <>
      <FAB
        icon={() => <Ionicons name="add-sharp" size={24} />}
        label="Add"
        onPress={onPress}
        onLongPress={onLongPress}
        style={[styles.fab]}
      />
    </>
  );
};
const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
  },
});
export default AddButton;
