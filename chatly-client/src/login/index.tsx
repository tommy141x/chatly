import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { userState } from "@/lib/user";
import { sessionState } from "@/lib/session";
import { endpointState } from "@/lib/endpoint";
import { useDebouncedCallback } from "use-debounce";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { Button, ButtonText, ButtonSpinner } from "@/components/ui/button";
import { CircleUserRound } from "lucide-react-native";
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

function Login() {
  const [endpoint, setEndpoint] = endpointState.use();
  const [error, setError] = useState("");
  const [userInput, setUserInput] = useState("");
  const [password, setPassword] = useState("");
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

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`${endpoint.url}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: userInput, password: password }),
      });
      const data = await response.json();
      if (response.ok) {
        sessionState.set(data.sessionToken);
        router.replace("/");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedHandleLogin = useDebouncedCallback(handleLogin, 1000, {
    maxWait: 2000,
  });

  return (
    <Card
      size="md"
      variant="elevated"
      className="bg-background-50 mb-5 w-[500px] rounded-xl p-10"
    >
      <Text className="text-sm font-medium mb-2">
        {endpoint.name} - {endpoint.description}
      </Text>
      <Heading size="xl" className="mb-2">
        Log In
      </Heading>
      <Text className={`${error ? "text-red-500" : "text-gray-500"}`}>
        {error || "Enter your username or email, and password to log in."}
      </Text>

      <FormControl
        size="md"
        isInvalid={!!error}
        isRequired={true}
        className="mb-4"
      >
        <FormControlLabel>
          <FormControlLabelText>Username or Email</FormControlLabelText>
        </FormControlLabel>
        <Input className="rounded-lg">
          <InputSlot>
            <CircleUserRound className="text-gray-400" />
          </InputSlot>
          <InputField
            placeholder="myusername or myemail@example.com"
            value={userInput}
            onChangeText={setUserInput}
          />
        </Input>
      </FormControl>

      <FormControl
        size="md"
        isInvalid={!!error}
        isRequired={true}
        className="mb-4"
      >
        <FormControlLabel>
          <FormControlLabelText>Password</FormControlLabelText>
        </FormControlLabel>
        <Input className="rounded-lg">
          <InputField
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </Input>
        {error && (
          <FormControlError>
            <FormControlErrorIcon as={CircleUserRound} />
            <FormControlErrorText>{error}</FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>

      <Button onPress={debouncedHandleLogin} className="rounded-lg mb-4">
        {isLoading ? <ButtonSpinner /> : <ButtonText>Log In</ButtonText>}
      </Button>

      <Divider className="my-4" />

      <Button
        variant="outline"
        onPress={() => router.replace("/signup")}
        className="rounded-lg"
      >
        <ButtonText>Don't have an account? Sign up</ButtonText>
      </Button>
    </Card>
  );
}

export default Login;
