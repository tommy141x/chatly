import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
export default function Splash() {
  return (
    <GluestackUIProvider mode="dark">
      <View
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      ></View>
    </GluestackUIProvider>
  );
}
