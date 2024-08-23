import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { userState } from "@/lib/user";
import { sessionState } from "@/lib/session";
import { endpointState } from "@/lib/endpoint";
import { useDebouncedCallback } from "use-debounce";
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
import { isMobile } from "@/lib/utils";

function SignUp() {
  const [endpoint, setEndpoint] = endpointState.use();
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const validateUser = async () => {
      try {
        const response = await fetch(`${endpoint.url}/api/auth/validate`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const user = await response.json();
        if (user) {
          userState.set(user);
          router.replace("/");
        }
      } catch (error) {
        console.error("User validation error:", error);
      }
    };

    validateUser();
  }, []);

  const handleSignUp = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`${endpoint.url}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, displayName, password, email }),
      });
      const data = await response.json();
      if (response.ok) {
        sessionState.set(data.sessionToken);
        router.replace("/");
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("An error occurred during signup");
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

        <FormControl size="md" isInvalid={!!error} className="my-4">
          <FormControlLabel>
            <FormControlLabelText>Email</FormControlLabelText>
          </FormControlLabel>
          <Input
            className={`rounded-xl p-1 !border-2 ${
              error ? "border-none !ring-2" : ""
            }`}
          >
            <InputField
              placeholder="myemail@example.com"
              value={email}
              onChangeText={setEmail}
            />
          </Input>
        </FormControl>

        <FormControl size="md" isInvalid={!!error} className="mb-4">
          <FormControlLabel>
            <FormControlLabelText>Username</FormControlLabelText>
          </FormControlLabel>
          <Input
            className={`rounded-xl p-1 !border-2 ${
              error ? "border-none !ring-2" : ""
            }`}
          >
            <InputField
              placeholder="myusername"
              value={username}
              onChangeText={setUsername}
            />
          </Input>
        </FormControl>

        <FormControl size="md" isInvalid={!!error} className="mb-4">
          <FormControlLabel>
            <FormControlLabelText>Display Name</FormControlLabelText>
          </FormControlLabel>
          <Input
            className={`rounded-xl p-1 !border-2 ${
              error ? "border-none !ring-2" : ""
            }`}
          >
            <InputField
              placeholder="My Name"
              value={displayName}
              onChangeText={setDisplayName}
            />
          </Input>
        </FormControl>

        <FormControl size="md" isInvalid={!!error} className="mb-4">
          <FormControlLabel>
            <FormControlLabelText>Password</FormControlLabelText>
          </FormControlLabel>
          <Input
            className={`rounded-xl p-1 !border-2 ${
              error ? "border-none !ring-2" : ""
            }`}
          >
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
