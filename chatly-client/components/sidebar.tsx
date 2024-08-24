import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Image } from "@/components/ui/image";
import { userState } from "@/lib/user";
import { sessionState } from "@/lib/session";
import { HousePlus, MessageCircleMore } from "lucide-react-native";
import { endpointState } from "@/lib/endpoint";
import { Button, ButtonText } from "@/components/ui/button";
import { Pressable } from "@/components/ui/pressable";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/dialog";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Input, InputField } from "@/components/ui/input";

export default function SideBar() {
  const navigation = useNavigation();
  const endpoint = endpointState.get();
  const [user, setUser] = userState.use();
  const [session, setSession] = sessionState.use();
  const [serverName, setServerName] = useState("");
  const [serverBio, setServerBio] = useState("");
  const [showAlertDialog, setShowAlertDialog] = useState(false);

  const createServer = async () => {
    try {
      const response = await fetch(`${endpoint.url}/api/server`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session}`,
        },
        body: JSON.stringify({
          name: serverName,
          bio: serverBio,
        }),
      });
      const data = await response.json();
      console.log("Server created:", data);
      setShowAlertDialog(false);
      // You might want to update the UI or navigate to the new server
    } catch (error) {
      console.error("Failed to create server:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  return (
    <View className="bg-background-50 rounded-3xl h-full w-full gap-4 items-center justify-start pt-4">
      <Button variant="outline" className="w-14 h-14 rounded-full p-0">
        <MessageCircleMore className="h-7 w-7 text-primary" />
      </Button>
      <Image
        source={{
          uri: "https://mir-s3-cdn-cf.behance.net/project_modules/disp/ca5d4f138939351.6274c569dd1b6.gif",
        }}
        className="w-14 h-14 mx-auto rounded-full"
      />
      <Button
        variant="outline"
        onPress={() => setShowAlertDialog(true)}
        className="w-14 h-14 rounded-full items-center justify-center p-0"
      >
        <HousePlus className="h-7 w-7 text-primary" />
      </Button>

      <Dialog
        isOpen={showAlertDialog}
        onClose={() => setShowAlertDialog(false)}
      >
        <DialogContent>
          <DialogHeader>
            <Heading size="lg" className="text-typography-950 font-semibold">
              Create a New Server
            </Heading>
          </DialogHeader>
          <DialogContent>
            <ScrollView>
              <FormControl size="md" className="my-4">
                <FormControlLabel>
                  <FormControlLabelText>Server Name</FormControlLabelText>
                </FormControlLabel>
                <Input className="rounded-xl p-1 border-2">
                  <InputField
                    placeholder="Enter server name"
                    value={serverName}
                    onChangeText={setServerName}
                  />
                </Input>
              </FormControl>

              <FormControl size="md" className="mb-4">
                <FormControlLabel>
                  <FormControlLabelText>Server Bio</FormControlLabelText>
                </FormControlLabel>
                <Input className="rounded-xl p-1 border-2">
                  <InputField
                    placeholder="Enter server bio"
                    value={serverBio}
                    onChangeText={setServerBio}
                  />
                </Input>
              </FormControl>
            </ScrollView>
          </DialogContent>
          <DialogFooter>
            <Button
              variant="outline"
              action="secondary"
              onPress={() => setShowAlertDialog(false)}
              size="sm"
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button size="sm" onPress={createServer}>
              <ButtonText>Create Server</ButtonText>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </View>
  );
}
