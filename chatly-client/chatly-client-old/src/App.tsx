import { useEffect, useContext } from "react";
import { useState } from "state-pool";
import TitleBar, { setTitleBar } from "@/components/titlebar";
import SignUp from "@/components/signup";
import Login from "@/components/login";
import Dashboard from "@/components/dashboard";
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
import { Route, Switch, navigate } from "@/lib/router";
import axios from "axios";
function App() {
  const [server, setServer] = store.useState("server");
  const [user, setUser] = store.useState("user");
  document.documentElement.classList.add("dark");

  return (
    <div className="flex flex-col h-screen max-w-screen">
      <TitleBar />
      <div className="flex-1 flex items-center justify-center bg-background">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/signup" component={SignUp} />
          <Route path="/login" component={Login} />
          <Route
            path="*"
            component={() => (
              <main className="flex flex-col items-center gap-5 text-primary p-6">
                <h1 className="text-2xl font-bold">
                  You've reached a page that doesn't exist!
                </h1>
                <Button
                  onClick={() => {
                    navigate("/");
                  }}
                >
                  Go Home
                </Button>
              </main>
            )}
          />
        </Switch>
      </div>
    </div>
  );
}

export default App;
