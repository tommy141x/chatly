import "@/global.css";
import * as React from "react";
import { PortalHost } from "@rn-primitives/portal";
import { StatusBar } from "expo-status-bar";
import { TitleBar } from "@/components/titlebar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text } from "react-native";
import { useUserStore } from "@/lib/user";
import { pingServer, validateUser, isWeb } from "@/lib/utils";
import { endpointState, setInitialEndpointState } from "@/lib/endpoint";
import * as SplashScreen from "expo-splash-screen";
import Splash from "@/components/splash-web";
import { Easing } from "react-native-reanimated";
import { Toaster } from "@/components/toaster";
import { Stack } from "expo-router";
import {
  useFonts,
  Poppins_100Thin,
  Poppins_100Thin_Italic,
  Poppins_200ExtraLight,
  Poppins_200ExtraLight_Italic,
  Poppins_300Light,
  Poppins_300Light_Italic,
  Poppins_400Regular,
  Poppins_400Regular_Italic,
  Poppins_500Medium,
  Poppins_500Medium_Italic,
  Poppins_600SemiBold,
  Poppins_600SemiBold_Italic,
  Poppins_700Bold,
  Poppins_700Bold_Italic,
  Poppins_800ExtraBold,
  Poppins_800ExtraBold_Italic,
  Poppins_900Black,
  Poppins_900Black_Italic,
} from "@expo-google-fonts/poppins";
import { useColorScheme } from "@/lib/utils";

SplashScreen.preventAutoHideAsync();
import { vars } from "nativewind";
export default function Layout() {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const [appIsReady, setAppIsReady] = React.useState(false);
  const { user, setUser } = useUserStore.getState();
  let [fontsLoaded] = useFonts({
    Poppins_100Thin,
    Poppins_100Thin_Italic,
    Poppins_200ExtraLight,
    Poppins_200ExtraLight_Italic,
    Poppins_300Light,
    Poppins_300Light_Italic,
    Poppins_400Regular,
    Poppins_400Regular_Italic,
    Poppins_500Medium,
    Poppins_500Medium_Italic,
    Poppins_600SemiBold,
    Poppins_600SemiBold_Italic,
    Poppins_700Bold,
    Poppins_700Bold_Italic,
    Poppins_800ExtraBold,
    Poppins_800ExtraBold_Italic,
    Poppins_900Black,
    Poppins_900Black_Italic,
  });

  const forFade = ({ current }) => ({
    cardStyle: {
      opacity: current.progress,
    },
  });

  const loadColorScheme = async () => {
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
      <Toaster
        theme={colorScheme}
        toastOptions={{
          classNames: {
            toast: "bg-card",
            title: "text-foreground font-bold ml-2",
            description: "text-muted-foreground ml-2",
            actionButton: "bg-secondary",
            cancelButton: "bg-secondary",
            closeButton: "bg-secondary",
          },
        }}
      />
      <StatusBar style="auto" />
    </View>
  );
}
