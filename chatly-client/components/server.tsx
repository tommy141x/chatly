import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { Grid, GridItem } from "@/components/ui/grid";
import { Text } from "@/components/ui/text";
import { logout } from "@/lib/utils";
import { userState } from "@/lib/user";
import { Button, ButtonText, ButtonSpinner } from "@/components/ui/button";
import { router } from "expo-router";

export default function Server() {
  const [user, setUser] = userState.use();
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
      <Grid
        className="h-full gap-5"
        _extra={{
          className: "grid-cols-4",
        }}
      >
        <GridItem
          className="bg-background-50 rounded-3xl"
          _extra={{
            className: "col-span-1",
          }}
        ></GridItem>
        <GridItem
          className="bg-background-50 rounded-3xl"
          _extra={{
            className: "col-span-3",
          }}
        >
          <Text>Welcome {user?.display_name}</Text>

          <Button
            onPress={handleLogout}
            variant="outline"
            className="mt-4 mx-auto"
            disabled={isLoggingOut}
          >
            {isLoggingOut ? <ButtonSpinner /> : <ButtonText>Logout</ButtonText>}
          </Button>
        </GridItem>
      </Grid>
    </View>
  );
}
