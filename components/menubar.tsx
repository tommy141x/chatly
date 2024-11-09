import React from "react";
import { View, ScrollView, Image } from "react-native";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { HousePlus, MessageCircleMore } from "lucide-react-native";
import { toast } from "@/components/toaster";

// Store imports
import { useUserStore } from "@/lib/user";
import { useSessionStore } from "@/lib/session";
import { useEndpointStore } from "@/lib/endpoint";

// UI Components
import { Button } from "@/components/ui/button";
import { Pressable } from "react-native";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogDescription,
  DialogClose,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { H4, P } from "@/components/ui/typography";
import { Text } from "@/components/ui/text";

interface ServerFormData {
  name: string;
  bio: string;
}

interface Server {
  id: string;
  name: string;
  bio: string;
}

export default function SideBar() {
  const { endpoint } = useEndpointStore.getState();
  const { user } = useUserStore.getState();
  const { session } = useSessionStore.getState();
  const [servers, setServers] = React.useState<Server[]>([]);
  const [showDialog, setShowDialog] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setError: setFormError,
  } = useForm<ServerFormData>({
    defaultValues: {
      name: "",
      bio: "",
    },
  });

  const createServer = async (data: ServerFormData) => {
    toast("My toast", {
      description: "My description",
      duration: 5000,
      icon: <MessageCircleMore />,
    });
    setTimeout(() => {
      toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
        loading: "Downloading more RAM...",
        success: "RAM downloaded!",
        error: "Not enough RAM found...",
      });
    }, 2000);
    setIsLoading(true);
    try {
      /* Keeping your API method commented as requested
      const response = await fetch(`${endpoint.url}/api/server`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session}`,
        },
        body: JSON.stringify({
          name: data.name,
          bio: data.bio,
        }),
      });
      const serverData = await response.json();
      setServers([...servers, serverData]);
      toast.success('Server created successfully!');
      router.replace(`/server/${serverData.id}`);
      */
      handleCloseDialog();
    } catch (error: any) {
      setFormError("root", {
        type: "manual",
        message: error.message || "Failed to create server",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchServers = async () => {
    try {
      /* Keeping your API method commented as requested
      const response = await fetch(`${endpoint.url}/api/server`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session}`,
        },
      });
      const data = await response.json();
      setServers(data);
      */
    } catch (error: any) {
      toast.error("Failed to fetch servers");
      console.error("Failed to fetch servers:", error);
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    reset();
  };

  React.useEffect(() => {
    fetchServers();
  }, []);

  return (
    <View className="w-[90px] bg-background text-foreground rounded-3xl h-full gap-4 flex items-center justify-start pt-4">
      <Button variant="outline" className="w-14 h-14 rounded-full p-0">
        <MessageCircleMore className="h-7 w-7 text-foreground" />
      </Button>

      {servers.map((server) => (
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
        onPress={() => setShowDialog(true)}
        className="w-14 h-14 rounded-full items-center justify-center p-0"
      >
        <HousePlus className="h-7 w-7 text-foreground" />
      </Button>

      <Dialog open={showDialog} onOpenChange={handleCloseDialog}>
        <DialogContent className="w-[400px] min-w-[200px] bg-card">
          <DialogHeader>
            <DialogTitle>Create a New Server</DialogTitle>
            <DialogDescription>
              Fill in the details for your new server
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label nativeID="serverName">Server Name</Label>
              <Controller
                control={control}
                name="name"
                rules={{
                  required: "Server name is required",
                  minLength: {
                    value: 3,
                    message: "Server name must be at least 3 characters",
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Enter server name"
                    value={value}
                    onChangeText={onChange}
                    aria-labelledby="serverName"
                    className="rounded-xl mt-2"
                  />
                )}
              />
              {errors.name && (
                <P className="text-sm text-destructive mt-1">
                  {errors.name.message}
                </P>
              )}
            </div>

            <div>
              <Label nativeID="serverBio">Server Bio</Label>
              <Controller
                control={control}
                name="bio"
                rules={{
                  required: "Server bio is required",
                  maxLength: {
                    value: 200,
                    message: "Bio must be less than 200 characters",
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Enter server bio"
                    value={value}
                    onChangeText={onChange}
                    aria-labelledby="serverBio"
                    className="rounded-xl mt-2"
                  />
                )}
              />
              {errors.bio && (
                <Text className="text-sm text-destructive mt-1">
                  {errors.bio.message}
                </Text>
              )}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                onPress={handleCloseDialog}
                className="w-24"
              >
                <P>Cancel</P>
              </Button>
            </DialogClose>
            <Button
              onPress={handleSubmit(createServer)}
              className="w-24"
              disabled={isLoading}
            >
              <Text>{isLoading ? "Creating..." : "Create"}</Text>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </View>
  );
}
