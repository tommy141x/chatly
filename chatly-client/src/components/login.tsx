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
import { useState } from "state-pool";

function Login() {
  const [server, setServer] = store.useState("server");
  return (
    <Card className="w-full max-w-sm border-none">
      <CardHeader>
        <Button variant="outline">
          {server.name} - {server.description}
        </Button>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
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
export default Login;
