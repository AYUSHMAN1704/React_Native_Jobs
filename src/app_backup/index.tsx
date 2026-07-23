import { ScreenHeaderBtn } from "@/components";
import { COLORS, icons } from "@/constants";
import { Stack, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";


export default function Index() {

  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          // headerLeft: () => (
          //   <ScreenHeaderBtn iconUrl={icons.menu} dimension="60%" />
          // ),
          // headerRight: () => (
          //   <ScreenHeaderBtn iconUrl={icons.menu} dimension="60%" />
          // )
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.lightWhite
  },
});