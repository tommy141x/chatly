import React from "react";
import { View, ScrollView, Image } from "react-native";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { HousePlus, MessageCircleMore } from "lucide-react-native";
import { toast } from "sonner-native";

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
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { H4, P } from "@/components/ui/typography";

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
      toast.error(error.message || "Failed to create server");
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
    <View className="w-[90px] bg-background-50 rounded-3xl h-full gap-4 flex items-center justify-start pt-4">
      <Button variant="outline" className="w-14 h-14 rounded-full p-0">
        <MessageCircleMore className="h-7 w-7 text-primary" />
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
        <HousePlus className="h-7 w-7 text-primary" />
      </Button>

      <Dialog open={showDialog} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <H4 className="font-semibold">Create a New Server</H4>
            <P className="text-sm text-muted-foreground">
              Fill in the details for your new server
            </P>
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
                <P className="text-sm text-destructive mt-1">
                  {errors.bio.message}
                </P>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onPress={handleCloseDialog}
              className="w-24"
            >
              Cancel
            </Button>
            <Button
              onPress={handleSubmit(createServer)}
              className="w-24"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </View>
  );
}
