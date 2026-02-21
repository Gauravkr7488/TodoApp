import { FAB } from "react-native-paper";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  onPress: () => void;
  onLongPress?: () => void;
};
const ClearButton = ({ onPress, onLongPress }: Props) => {
  return (
    <>
      <FAB
        icon={() => <Ionicons name="trash-bin-sharp" size={24}  />}
        label="Clear"
        onPress={onPress}
        onLongPress={onLongPress}
        style={[styles.fab, { bottom: 80 }]}
      />
    </>
  );
};
const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    // backgroundColor: "#7ec598ff",
  },
});
export default ClearButton;
