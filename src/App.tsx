import { useEffect, useContext } from "react";
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

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
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
    <>
      <TitleBar />
      <div className="flex flex-col items-center justify-center h-[96vh] bg-background">
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
                Oops! Looks like you got lost!
              </h1>
            </main>
          </Route>
        </Switch>
      </div>
    </>
  );
}

export default App;
