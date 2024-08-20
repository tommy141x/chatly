import { useEffect, useContext } from "react";
import { useState } from "state-pool";
import TitleBar, { setTitleBar } from "@/components/titlebar";
import Login from "@/components/login";
import { Link, Route, Switch } from "wouter";
import "@/styles/globals.css";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import isTauri, { isTauriDesktop } from "@/components/isTauri";
import store from "@/lib/store";
import { pingServer } from "@/lib/client";

function App() {
  const [serverPinged, setServerPinged] = useState(false);
  useEffect(() => {
    document.documentElement.classList.add("dark");
    const pingServerAndSetState = async () => {
      try {
        await pingServer(); // Call the debounced function directly
        setServerPinged(true);
      } catch (error) {
        console.error("Error during server ping:", error);
      }
    };
    pingServerAndSetState();
    setTitleBar(
      <DropdownMenu className="bg-transparent">
        <DropdownMenuTrigger asChild className="!ring-0">
          <Button variant="ghost" className="hover:bg-primary/10 p-2">
            <p className="font-bold">Chatly</p>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="border-none">
          <DropdownMenuItem className="cursor-pointer" asChild>
            <Link href="/login">Login</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" asChild>
            <Link href="/">Home</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <TitleBar />
      <div className="flex-1 flex items-center justify-center bg-background">
        <Switch>
          <Route path="/">
            <main className="flex-grow text-primary p-6">
              <h1 className="text-2xl font-bold">
                {isTauriDesktop ? "This is the desktop" : "This is the browser"}
              </h1>
            </main>
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route>
            <main className="flex-grow text-primary p-6">
              <h1 className="text-2xl font-bold">
                Fallback route, nothing here
              </h1>
            </main>
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default App;
