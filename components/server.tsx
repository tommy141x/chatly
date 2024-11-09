import React, { useState } from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { logout } from "@/lib/utils";
import { useUserStore } from "@/lib/user";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { router } from "expo-router";

export default function Server() {
  const { user } = useUserStore.getState();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Handle logout error (e.g., show an error message)
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <View className="h-full">
      <View
        className="h-full gap-5"
        _extra={{
          className: "grid-cols-4",
        }}
      >
        <View
          className="bg-background-50 rounded-3xl"
          _extra={{
            className: "col-span-1",
          }}
        ></View>
        <View
          className="bg-background-50 rounded-3xl"
          _extra={{
            className: "col-span-3",
          }}
        >
          <Text>Welcome {user?.name}</Text>

          <Button
            onPress={handleLogout}
            variant="outline"
            className="mt-4 mx-auto"
            disabled={isLoggingOut}
          >
            {isLoggingOut ? <ActivityIndicator /> : <Text>Logout</Text>}
          </Button>
        </View>
      </View>
    </View>
  );
}
