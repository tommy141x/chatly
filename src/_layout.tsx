import "@/global.css";
import * as React from "react";
import { PortalHost } from "@rn-primitives/portal";
import { StatusBar } from "expo-status-bar";
import { TitleBar } from "@/components/titlebar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View } from "react-native";
import { useUserStore } from "@/lib/user";
import { pingServer, validateUser, isWeb } from "@/lib/utils";
import { endpointState, setInitialEndpointState } from "@/lib/endpoint";
import * as SplashScreen from "expo-splash-screen";
import Splash from "@/components/splash-web";
import { Easing } from "react-native-reanimated";
import { Toaster } from "sonner-native";
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
import { useColorScheme } from "@/lib/utils";

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
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

  const loadColorScheme = async () => {
    setColorScheme("dark");
    const theme = await AsyncStorage.getItem("theme");
    if (!theme) {
      AsyncStorage.setItem("theme", colorScheme);
      return;
    }
    const colorTheme = theme === "dark" ? "dark" : "light";
    if (colorTheme !== colorScheme) {
      setColorScheme(colorTheme);
      return;
    }
  };

  React.useEffect(() => {
    async function prepare() {
      if (isWeb) {
        document.documentElement.classList.add("bg-background");
      }
      await loadColorScheme();
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
        <Splash />
        <StatusBar style="auto" />
      </View>
    );
  }

  /* transitionSpec does not work in expo-router */

  return (
    <View className="bg-background flex flex-col h-screen max-w-screen">
      <TitleBar />
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
      <PortalHost />
      <Toaster />
      <StatusBar style="auto" />
    </View>
  );
}
