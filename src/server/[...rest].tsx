import React, { Children, useState } from "react";
import { View } from "react-native";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Grid, GridItem } from "@/components/ui/grid";
import { MessageCircle, Mic } from "lucide-react-native";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText, ButtonSpinner } from "@/components/ui/button";
import MenuBar from "@/components/menubar";
import { endpointState } from "@/lib/endpoint";
import { userState } from "@/lib/user";
import { sessionState } from "@/lib/session";
import {
  useLocalSearchParams,
  useGlobalSearchParams,
  router,
} from "expo-router";
export default function App() {
  const endpoint = endpointState.get();
  const [user, setUser] = userState.use();
  const [session, setSession] = sessionState.use();
  const [input, setInput] = useState("");
  const local = useLocalSearchParams();
  const [server, setServer] = useState({});
  const [channel, setChannel] = useState({});
  const serverId = local.rest[0];
  const categoryId = local.rest[2];
  const channelId = local.rest[4];

  const fetchServer = async () => {
    try {
      //include id in request
      console.log(local);
      const response = await fetch(
        `${endpoint.url}/api/server?id=${serverId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session}`,
          },
        }
      );
      const data = await response.json();
      setServer(data);
      if (!categoryId) categoryId = "0";
      if (!channelId) channelId = "0";
      setChannel(data.layout[categoryId].channels[channelId]);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    fetchServer();
  }, []);

  const sendMessage = async () => {};

  return (
    <View className="flex flex-row h-full w-full p-5 gap-5 bg-background-0">
      <MenuBar />
      <View className="flex-grow">
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
          >
            <View className="relative w-full h-48">
              <Image
                source={{
                  uri: `${endpoint.url}/pub/serverBanners/${server.id}.png`,
                }}
                className="w-full h-full rounded-3xl"
                resizeMode="cover"
              />
              <View className="absolute bottom-4 left-4">
                <Text className="text-primary-200">{server.bio}</Text>
                <Text className="text-2xl font-bold text-white">
                  {server.name}
                </Text>
              </View>
              {(server?.layout || []).map((category, categoryIndex) => (
                <View key={categoryIndex}>
                  <Text className="text-md ml-1 mt-2 px-5 font-bold text-white">
                    {category.categoryName}
                  </Text>
                  {category.channels.map((channel, channelIndex) => (
                    <Button
                      key={channel.id}
                      className="bg-background-50 hover:!bg-background-100 rounded-xl m-1 justify-start"
                      onPress={() => {
                        router.push(
                          `/server/${server.id}/category/${categoryIndex}/channel/${channelIndex}`
                        );
                      }}
                    >
                      {channel.type === "voice" ? (
                        <Mic className="mr-1" />
                      ) : (
                        <MessageCircle className="mr-1" />
                      )}
                      <Text>{channel.name} </Text>
                    </Button>
                  ))}
                </View>
              ))}
            </View>
          </GridItem>
          <GridItem
            className="bg-background-50 rounded-3xl"
            _extra={{
              className: "col-span-3",
            }}
          >
            {channel && (
              <View>
                <Text className="text-2xl font-bold text-white">
                  {channel.name}
                </Text>
                <Input variant="outline" size="md">
                  <InputField
                    onChange={(e) => {
                      setInput(e.target.value);
                    }}
                    placeholder="Enter Text here..."
                  />
                </Input>
                <Button
                  onPress={sendMessage}
                  className="bg-primary-200 rounded-xl"
                >
                  <ButtonText>Send</ButtonText>
                </Button>
              </View>
            )}
          </GridItem>
        </Grid>
      </View>
    </View>
  );
}
