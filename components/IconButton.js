import { Pressable, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
export default function IconButton({ icon, color, size, onPressFnc }) {
  return (
    <Pressable
      style={({ pressed }) => pressed && styles.Pressed}
      onPress={onPressFnc}
    >
      <View style={styles.buttonContainer}>
        <Ionicons name={icon} color={color} size={size} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 24,
    padding: 6,
    marginHorizontal: 8,
    marginVertical: 2,
  },
  Pressed: {
    opacity: 0.5,
  },
});
