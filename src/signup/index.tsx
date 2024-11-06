import * as React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { userState } from "@/lib/user";
import { useSessionStore } from "@/lib/session";
import { useEndpointStore } from "@/lib/endpoint";
import { useDebouncedCallback } from "use-debounce";
import { Account, ID } from "react-native-appwrite";
import { client } from "@/lib/appwrite";
import { Card } from "@/components/ui/card";
import { Button, ButtonText, ButtonSpinner } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { CircleUserRound, Mail, User, Lock } from "lucide-react-native";
import { Input, InputField, InputSlot } from "@/components/ui/input";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { isMobile, getDeviceInfo } from "@/lib/utils";

function SignUp() {
  const { endpoint } = useEndpointStore.getState();
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSignUp = async () => {
    const { setSession } = useSessionStore.getState();
    setIsLoading(true);
    setError("");

    try {
      // Create a new Appwrite account
      const account = new Account(client);
      const result = await account.create(ID.unique(), email, password, name);

      // Store the session token
      setSession(result.$id);

      // Redirect the user to the home page
      router.replace("/");
    } catch (e) {
      // Handle any errors that occurred during sign-up
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedHandleSignUp = useDebouncedCallback(handleSignUp, 0, {
    maxWait: 2000,
  });

  return (
    <View className="flex-1 flex items-center justify-center bg-background-0">
      <Card
        size="md"
        variant="elevated"
        className={`mb-5 rounded-3xl p-10 ${
          isMobile ? "w-full" : "bg-background-50 w-[450px]"
        }`}
      >
        <Text
          className={`${isMobile ? "text-lg" : "text-sm"} font-medium mb-2`}
        >
          {endpoint.name} - {endpoint.description}
        </Text>
        <Heading size={`${isMobile ? "3xl" : "xl"}`} className="mb-2">
          Sign Up
        </Heading>
        <Text className={`${error ? "text-red-500" : "text-gray-500"}`}>
          {error || "Enter your details below to create your account."}
        </Text>
        <FormControl size="md" isInvalid={!!error} className="mb-4">
          <FormControlLabel>
            <FormControlLabelText>Name</FormControlLabelText>
          </FormControlLabel>
          <Input className="rounded-xl p-1 !border-2 !ring-2">
            <InputField
              placeholder="My Name"
              value={name}
              onChangeText={setName}
            />
          </Input>
        </FormControl>

        <FormControl size="md" isInvalid={!!error} className="mb-4">
          <FormControlLabel>
            <FormControlLabelText>Email</FormControlLabelText>
          </FormControlLabel>
          <Input className="rounded-xl p-1 !border-2 !ring-2">
            <InputField
              placeholder="my email"
              value={email}
              onChangeText={setEmail}
            />
          </Input>
        </FormControl>

        <FormControl size="md" isInvalid={!!error} className="mb-4">
          <FormControlLabel>
            <FormControlLabelText>Password</FormControlLabelText>
          </FormControlLabel>
          <Input className="rounded-xl p-1 !border-2 !ring-2">
            <InputField
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </Input>
        </FormControl>

        <Button onPress={debouncedHandleSignUp} className="rounded-xl mb-4">
          {isLoading ? <ButtonSpinner /> : <ButtonText>Sign Up</ButtonText>}
        </Button>

        <Divider className="my-4" />

        <Button
          variant="outline"
          onPress={() => router.push("/login")}
          className="rounded-xl"
        >
          <ButtonText>Already have an account? Sign in</ButtonText>
        </Button>
      </Card>
    </View>
  );
}

export default SignUp;
