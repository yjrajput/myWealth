import { Stack } from "expo-router";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function RootLayout() {
  
  return <SafeAreaView>
    <View >
      <Text className="text-2xl font-bold text-blue-500 ">Hello my name is yuvraj </Text>
    </View>
  </SafeAreaView>
}
