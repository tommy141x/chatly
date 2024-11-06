import React, { Children, useState } from "react";
import { View, ScrollView } from "react-native";
import { Image } from "@/components/ui/image";
import { useUserStore } from "@/lib/user";
import { useSessionStore } from "@/lib/session";
import { HousePlus, MessageCircleMore } from "lucide-react-native";
import { useEndpointStore } from "@/lib/endpoint";
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
import { isMobile, isWindowSmall } from "@/lib/utils";
import { router } from "expo-router";

export default function SideBar() {
  const { endpoint } = useEndpointStore.getState();
  const { user } = useUserStore.getState();
  const { session } = useSessionStore.getState();
  const [servers, setServers] = useState([]);
  const [serverName, setServerName] = useState("");
  const [serverBio, setServerBio] = useState("");
  const [showAlertDialog, setShowAlertDialog] = useState(false);

  const createServer = async () => {
    /*try {
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
      setServers([...servers, data]);
      console.log("Made server and got ID: " + data.id);
      router.replace(`/server/${data.id}`);
      setShowAlertDialog(false);
      // You might want to update the UI or navigate to the new server
    } catch (error) {
      console.error("Failed to create server:", error);
      // Handle error (e.g., show an error message to the user)
      }*/
  };

  const fetchServers = async () => {
    /*try {
      const response = await fetch(`${endpoint.url}/api/server`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session}`,
        },
      });
      const data = await response.json();
      setServers(data); // Store the fetched servers in state
    } catch (error) {
      console.error("Failed to fetch servers:", error);
      }*/
  };

  React.useEffect(() => {
    fetchServers();
  }, []);

  return (
    <View className="w-[90px] bg-background-50 rounded-3xl h-full gap-4 flex items-center justify-start pt-4">
      <Button variant="outline" className="w-14 h-14 rounded-full p-0">
        <MessageCircleMore className="h-7 w-7 text-primary" />
      </Button>
      {(servers || []).map((server) => (
        <Pressable
          key={server.id}
          onPress={() => router.replace(`/server/${server.id}`)}
        >
          <Image
            source={{
              uri: `${endpoint.url}/pub/serverAvatars/${server.id}.png`,
            }}
            className="w-14 h-14 rounded-full hover:opacity-50 transition duration-300"
          />
        </Pressable>
      ))}
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
        snapPoints={[55]}
      >
        <DialogContent>
          <DialogHeader>
            <Heading size="lg" className="text-typography-950 font-semibold">
              Create a New Server
            </Heading>
          </DialogHeader>
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
