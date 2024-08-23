import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { TitleBar } from "@/components/titlebar";
import { View } from "react-native";
import { Slot } from "expo-router";
import { pingServer } from "@/lib/utils";
import { endpointState, setInitialEndpointState } from "@/lib/endpoint";
import * as SplashScreen from "expo-splash-screen";
import "@/styles/global.css";

export default function Layout() {
  const [appIsReady, setAppIsReady] = React.useState(false);
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        await setInitialEndpointState();
        const response = await pingServer();
        if (response) {
          endpointState.set(response);
        }
        await SplashScreen.hideAsync();
        setAppIsReady(true);
      } catch (error) {
        console.error("Error pinging server:", error);
      }
    };

    fetchData();
  }, []);

  if (!appIsReady) {
    return null;
  }

  return (
    <GluestackUIProvider mode="dark">
      <View className="flex flex-col h-screen max-w-screen">
        <TitleBar />
        <View className="flex-1 flex items-center justify-center bg-background-0">
          <Slot />
          <StatusBar style="auto" />
        </View>
      </View>
    </GluestackUIProvider>
  );
}
