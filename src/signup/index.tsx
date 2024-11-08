import * as React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { Account, ID } from "react-native-appwrite";
import { client } from "@/lib/appwrite";
import { userState } from "@/lib/user";
import { useSessionStore } from "@/lib/session";
import { useEndpointStore } from "@/lib/endpoint";
import { useDebouncedCallback } from "use-debounce";
import { toast } from "sonner-native";

// UI Components
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { H4, P } from "@/components/ui/typography";
import { isMobile } from "@/lib/utils";

interface FormData {
  name: string;
  email: string;
  password: string;
}

function SignUp() {
  const { endpoint } = useEndpointStore.getState();
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    const { setSession } = useSessionStore.getState();
    setIsLoading(true);

    try {
      const account = new Account(client);
      const result = await account.create(
        ID.unique(),
        data.email,
        data.password,
        data.name,
      );

      setSession(result.$id);
      toast.success("Account created successfully!");
      router.replace("/");
    } catch (e: any) {
      toast.error(e.message);
      setFormError("root", {
        type: "manual",
        message: e.message,
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

        <H4 className={`${isMobile ? "text-3xl" : "text-xl"} mb-2`}>Sign Up</H4>

        <P className="text-sm text-muted-foreground mb-6">
          Enter your details below to create your account.
        </P>

        <div className="space-y-4">
          <div>
            <Label nativeID="name">Name</Label>
            <Controller
              control={control}
              name="name"
              rules={{ required: "Name is required" }}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="My Name"
                  value={value}
                  onChangeText={onChange}
                  aria-labelledby="name"
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
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
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

          <Button
            onPress={debouncedHandleSubmit}
            className="w-full rounded-xl"
            disabled={isLoading}
          >
            {isLoading ? <P>Creating account...</P> : <P>Sign Up</P>}
          </Button>
        </div>

        <Separator className="my-6" />

        <Button
          variant="outline"
          onPress={() => router.push("/login")}
          className="w-full rounded-xl"
        >
          <P>Already have an account? Sign in</P>
        </Button>
      </Card>
    </View>
  );
}

export default SignUp;
