import * as React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { Account } from "react-native-appwrite";
import { client } from "@/lib/appwrite";
import { useUserStore } from "@/lib/user";
import { useSessionStore } from "@/lib/session";
import { useEndpointStore } from "@/lib/endpoint";
import { useDebouncedCallback } from "use-debounce";
import { toast } from "sonner-native";
import { getDeviceInfo } from "@/lib/utils";

// UI Components
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { H4, P } from "@/components/ui/typography";
import { isMobile } from "@/lib/utils";

interface LoginFormData {
  email: string;
  password: string;
}

function Login() {
  const { endpoint } = useEndpointStore.getState();
  const { setUser } = useUserStore.getState();
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    const { setSession } = useSessionStore.getState();
    setIsLoading(true);

    try {
      const deviceInfo = await getDeviceInfo();
      const account = new Account(client);

      const session = await account.createEmailPasswordSession(
        data.email,
        data.password,
      );

      if (session) {
        setSession(session.$id);
        toast.success("Logged in successfully!");
        router.replace("/");
      } else {
        throw new Error("Login failed");
      }
    } catch (error: any) {
      const errorMessage = error.message || "An error occurred during login";
      toast.error(errorMessage);
      setFormError("root", {
        type: "manual",
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedHandleSubmit = useDebouncedCallback(
    handleSubmit(onSubmit),
    0,
    {
      maxWait: 2000,
    },
  );

  return (
    <View className="flex-1 flex items-center justify-center bg-background">
      <Card
        className={`mb-5 rounded-3xl p-10 ${isMobile ? "w-full" : "w-[450px]"}`}
      >
        <H4
          className={`${isMobile ? "text-lg" : "text-base"} font-medium mb-2`}
        >
          {endpoint.name} - {endpoint.description}
        </H4>

        <H4 className={`${isMobile ? "text-3xl" : "text-xl"} mb-2`}>Log In</H4>

        <P className="text-sm text-muted-foreground mb-6">
          Enter your email and password to access your account.
        </P>

        <div className="space-y-4">
          <div>
            <Label nativeID="email">Email</Label>
            <Controller
              control={control}
              name="email"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="my@email.com"
                  value={value}
                  onChangeText={onChange}
                  aria-labelledby="email"
                  className="rounded-xl mt-2"
                />
              )}
            />
            {errors.email && (
              <P className="text-sm text-destructive mt-1">
                {errors.email.message}
              </P>
            )}
          </div>

          <div>
            <Label nativeID="password">Password</Label>
            <Controller
              control={control}
              name="password"
              rules={{
                required: "Password is required",
              }}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Enter your password"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry
                  aria-labelledby="password"
                  className="rounded-xl mt-2"
                />
              )}
            />
            {errors.password && (
              <P className="text-sm text-destructive mt-1">
                {errors.password.message}
              </P>
            )}
          </div>

          {errors.root && (
            <P className="text-sm text-destructive">{errors.root.message}</P>
          )}

          <Button
            onPress={debouncedHandleSubmit}
            className="w-full rounded-xl"
            disabled={isLoading}
          >
            {isLoading ? <P>Logging in...</P> : <P>Log In</P>}
          </Button>
        </div>

        <Separator className="my-6" />

        <Button
          variant="outline"
          onPress={() => router.replace("/signup")}
          className="w-full rounded-xl"
        >
          <P>Don't have an account? Sign up</P>
        </Button>
      </Card>
    </View>
  );
}

export default Login;
