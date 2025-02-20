import { Text, View, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

export default function wineDetails() {
    const {id} = useLocalSearchParams();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>welcome to details of {id}</Text>
    </View>
  );
}
