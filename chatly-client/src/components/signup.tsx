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
import { navigate } from "wouter/use-browser-location";
import { useState } from "state-pool";

function SignUp() {
  const [server, setServer] = store.useState("server");
  const [user, setUser] = store.useState("user");
  //we can fetch at server.url + "/api/auth/signup"
  //we should update the user state with the response
  //we can navigate with  navigate("/", { replace: true });after a succesful signup
  return (
    <Card className="w-full max-w-sm border-none">
      <CardHeader>
        <Button variant="outline">
          {server.name} - {server.description}
        </Button>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your username below to create your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="username"
            placeholder="myusername"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => setCount(0)}>
          Sign in
        </Button>
      </CardFooter>
    </Card>
  );
}
export default SignUp;
