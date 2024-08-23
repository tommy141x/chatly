import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { userState } from "@/lib/user";
import { sessionState } from "@/lib/session";
import { endpointState } from "@/lib/endpoint";
import { useDebouncedCallback } from "use-debounce";
import { Card } from "@/components/ui/card";
import { Button, ButtonText, ButtonSpinner } from "@/components/ui/button";
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

  const debouncedHandleSignUp = useDebouncedCallback(handleSignUp, 1000, {
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
        Sign Up
      </Heading>
      <Text className={`${error ? "text-red-500" : "text-gray-500"}`}>
        {error || "Enter your details below to create your account."}
      </Text>

      <FormControl
        size="md"
        isInvalid={!!error}
        isRequired={true}
        className="mb-4"
      >
        <FormControlLabel>
          <FormControlLabelText>Email</FormControlLabelText>
        </FormControlLabel>
        <Input className="rounded-lg">
          <InputSlot>
            <Mail className="text-gray-400" />
          </InputSlot>
          <InputField
            placeholder="myemail@example.com"
            value={email}
            onChangeText={setEmail}
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
          <FormControlLabelText>Username</FormControlLabelText>
        </FormControlLabel>
        <Input className="rounded-lg">
          <InputSlot>
            <CircleUserRound className="text-gray-400" />
          </InputSlot>
          <InputField
            placeholder="myusername"
            value={username}
            onChangeText={setUsername}
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
          <FormControlLabelText>Display Name</FormControlLabelText>
        </FormControlLabel>
        <Input className="rounded-lg">
          <InputSlot>
            <User className="text-gray-400" />
          </InputSlot>
          <InputField
            placeholder="My Name"
            value={displayName}
            onChangeText={setDisplayName}
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
          <InputSlot>
            <Lock className="text-gray-400" />
          </InputSlot>
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

      <Button onPress={debouncedHandleSignUp} className="rounded-lg mb-4">
        {isLoading ? <ButtonSpinner /> : <ButtonText>Sign Up</ButtonText>}
      </Button>

      <Button
        variant="outline"
        onPress={() => router.push("/login")}
        className="rounded-lg"
      >
        <ButtonText>Already have an account? Sign in</ButtonText>
      </Button>
    </Card>
  );
}

export default SignUp;
