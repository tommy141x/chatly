import * as React from "react";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogFooter,
  AlertDialogBody,
} from "@/components/ui/alert-dialog";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { TitleBar } from "@/components/titlebar";
import { View } from "react-native";
import SideBar from "@/components/sidebar";
import Server from "@/components/server";
import { userState } from "@/lib/user";
import { validateUser } from "@/lib/utils";
import { router } from "expo-router";

export default function App() {
  React.useEffect(() => {
    const load = async () => {
      let userData = await validateUser();
      if (userData) {
        userState.set(userData);
      } else {
        router.replace("/login");
      }
    };
    load();
  }, []);

  const handleClose = () => setShowAlertDialog(false);
  return (
    <View className="flex flex-row h-full w-full p-5 gap-5 bg-background-0">
      <View className="w-[90px] h-full flex items-center justify-center">
        <SideBar />
      </View>
      <View className="flex-1 h-full">
        <Server />
      </View>
    </View>
  );
}
