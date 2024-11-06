import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { TitleBar } from "@/components/titlebar";
import { View } from "react-native";
import { useUserStore } from "@/lib/user";
import { pingServer, validateUser } from "@/lib/utils";
import { endpointState, setInitialEndpointState } from "@/lib/endpoint";
import * as SplashScreen from "expo-splash-screen";
import Splash from "@/components/splash-web";
import { Easing } from "react-native-reanimated";
import { Stack } from "expo-router";
import {
  useFonts,
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from "@expo-google-fonts/inter";
import "@/styles/global.css";

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [appIsReady, setAppIsReady] = React.useState(false);
  const { user, setUser } = useUserStore.getState();
  const [fontsLoaded] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

  const forFade = ({ current }) => ({
    cardStyle: {
      opacity: current.progress,
    },
  });

  React.useEffect(() => {
    async function prepare() {
      try {
        await setInitialEndpointState();
        const online = await pingServer();
        let userData = await validateUser();
        if (userData) {
          setUser(userData);
        }
        if (!online) {
          throw new Error("Server is not available");
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  React.useEffect(() => {
    if (appIsReady && fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady, fontsLoaded]);

  if (!appIsReady || !fontsLoaded) {
    return (
      <View className="flex flex-col h-screen max-w-screen">
        <TitleBar />
        <GluestackUIProvider mode="dark">
          <Splash />
        </GluestackUIProvider>
        <StatusBar style="auto" />
      </View>
    );
  }

  /* transitionSpec does not work in expo-router */

  return (
    <View className="flex flex-col h-screen max-w-screen">
      <TitleBar />
      <GluestackUIProvider mode="dark">
        <Stack
          screenOptions={{
            headerShown: false,
            animationEnabled: true,
            cardStyleInterpolator: forFade,
            transitionSpec: {
              open: {
                animation: "timing",
                config: {
                  duration: 200,
                  easing: Easing.out(Easing.ease),
                },
              },
              close: {
                animation: "timing",
                config: {
                  duration: 200,
                  easing: Easing.in(Easing.ease),
                },
              },
            },
          }}
        />
      </GluestackUIProvider>
      <StatusBar style="auto" />
    </View>
  );
}
