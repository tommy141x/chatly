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
import { useState } from "state-pool";
import { validateUser, pingServer } from "@/lib/client";
import axios from "axios";
import debounce from "debounce";

function Login() {
  const [server, setServer] = store.useState("server");
  const [user, setUser] = store.useState("user");
  const [session, setSession] = store.useState("session");

  const [error, setError] = useState("");
  const [userInput, setUserInput] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const pingServerAndSetState = async () => {
      try {
        let ping = await pingServer();
        setServer({ ...ping, timestamp: Date.now() });
        // Doesn't trigger a re-render or it's due to debouncing
      } catch (error) {
        console.error("Error during server ping:", error);
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

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${server.url}/api/auth/login`,
        { user: userInput, password: password },
        { headers: { "Content-Type": "application/json" } },
      );

      setSession(response.data.sessionToken);

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.error || "Login failed");
    }
  };
  const debouncedHandleLogin = debounce(handleLogin, 1000, { immediate: true });

  return (
    <Card className="w-[450px] p-5 border-none">
      <CardHeader>
        <Button variant="outline">
          {server.name} - {server.description}
        </Button>
        <CardTitle className="text-2xl">Log In</CardTitle>
        <CardDescription className={error ? "text-destructive" : ""}>
          {error || "Enter your username or email, and password to log in."}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="user">Username or Email</Label>
          <Input
            id="user"
            type="text"
            placeholder="myusername or myemail@example.com"
            required
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
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
        <Button className="w-full" onClick={debouncedHandleLogin}>
          Log In
        </Button>
        <Link
          href="/signup"
          className="mt-4 text-sm text-muted-foreground hover:text-primary"
        >
          Don't have an account? Sign up
        </Link>
      </CardFooter>
    </Card>
  );
}

export default Login;
