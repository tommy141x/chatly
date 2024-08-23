import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { TitleBar } from "@/components/titlebar";
import { View } from "react-native";
import { pingServer } from "@/lib/utils";
import { endpointState, setInitialEndpointState } from "@/lib/endpoint";
import * as SplashScreen from "expo-splash-screen";
import Splash from "@/components/splash-web";
import { Easing } from "react-native-reanimated";
import { Stack } from "@/components/stack";
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
        const response = await pingServer();
        if (response) {
          endpointState.set(response);
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
      <GluestackUIProvider mode="dark">
        <View className="flex flex-col h-screen max-w-screen">
          <TitleBar />
          <Splash />
          <StatusBar style="auto" />
        </View>
      </GluestackUIProvider>
    );
  }

  return (
    <GluestackUIProvider mode="dark">
      <View className="flex flex-col h-screen max-w-screen">
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
        <StatusBar style="auto" />
      </View>
    </GluestackUIProvider>
  );
}
