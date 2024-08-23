import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import store from "@/lib/store";
import { navigate, Link } from "@/lib/router";
import { validateUser, pingServer } from "@/lib/client";
import { useState } from "state-pool";
import axios from "axios";
import debounce from "debounce";

function SignUp() {
  const [server, setServer] = store.useState("server");
  const [user, setUser] = store.useState("user");
  const [session, setSession] = store.useState("session");

  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const pingServerAndSetState = async () => {
      let ping = await pingServer();
      if (ping) {
        setServer({ ...ping, timestamp: Date.now() });
      }
    };
    const fetchUserData = async () => {
      let user = await validateUser();
      if (user) {
        setUser(user);
        navigate("/", { replace: true });
      }
    };
    fetchUserData();
    pingServerAndSetState();
  }, []);

  const handleSignUp = async () => {
    try {
      const response = await axios.post(
        `${server.url}/api/auth/signup`,
        {
          username,
          displayName,
          password: password,
          email,
        },
        { headers: { "Content-Type": "application/json" } },
      );

      setSession(response.data.sessionToken);

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Sign up error:", error);
      setError(error.response?.data?.error || "Login failed");
    }
  };
  const debouncedHandleSignUp = debounce(handleSignUp, 1000, {
    immediate: true,
  });

  return (
    <Card className="w-[450px] p-5 border-none">
      <CardHeader>
        <Button variant="outline">
          {server.name} - {server.description}
        </Button>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription className={error ? "text-destructive" : ""}>
          {error ||
            "Enter your username, display name, password, and email below to create your account."}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="myemail@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="myusername"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="displayName">Display Name</Label>
          <Input
            id="displayName"
            type="text"
            placeholder="My Name"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center">
        <Button className="w-full" onClick={debouncedHandleSignUp}>
          Sign Up
        </Button>
        <Link
          href="/login"
          className="mt-4 text-sm text-muted-foreground hover:text-primary"
        >
          Already have an account? Sign in
        </Link>
      </CardFooter>
    </Card>
  );
}

export default SignUp;
