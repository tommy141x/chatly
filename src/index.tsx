import * as React from "react";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { TitleBar } from "@/components/titlebar";
import { View } from "react-native";
import MenuBar from "@/components/menubar";
import Server from "@/components/server";
import { useUserStore } from "@/lib/user";
import { validateUser } from "@/lib/utils";
import { router } from "expo-router";

export default function App() {
  React.useEffect(() => {
    const load = async () => {
      let userData = await validateUser();
      if (userData) {
        const { setUser } = useUserStore.getState();
        setUser(userData);
      } else {
        //router.replace("/login");
      }
    };
    load();
  }, []);

  const handleClose = () => setShowAlertDialog(false);
  return (
    <View className="flex flex-row h-full w-full p-5 gap-5 bg-background">
      <MenuBar />
      <View className="flex-grow">
        <Server />
      </View>
    </View>
  );
}
