import { useEffect, useContext } from "react";
import { useState } from "state-pool";
import TitleBar, { setTitleBar } from "@/components/titlebar";
import SignUp from "@/components/signup";
import Login from "@/components/login";
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
import { pingServer, logout } from "@/lib/client";
import { Route, Switch, navigate } from "@/lib/router";
import axios from "axios";
function App() {
  const [server, setServer] = store.useState("server");
  const [user, setUser] = store.useState("user");
  const [serverPinged, setServerPinged] = useState(false);
  document.documentElement.classList.add("dark");
  useEffect(() => {
    const pingServerAndSetState = async () => {
      try {
        await pingServer(); // Call the debounced function directly
        setServerPinged(true);
      } catch (error) {
        console.error("Error during server ping:", error);
      }
    };
    pingServerAndSetState();
  }, []);

  /*
  middleware={async (next, location) => {
    if (user && user.sessionToken) {
      try {
        // Make an API request to verify the user session
        const userResponse = await axios.get(
          `${server.url}/api/auth/user`,
          {
            headers: {
              Authorization: `Bearer ${user.sessionToken}`,
              "Content-Type": "application/json",
            },
          },
        );

        const userData = userResponse.data;
        // If user data is valid, proceed to the next route
        if (userData) {
          setUser(userData);
          return next();
        }
      } catch (error) {
        console.error("User verification failed:", error);
      }
    }

    // If no session token or verification fails, redirect to login
    return next("/login");
  }}
  */

  return (
    <div className="flex flex-col h-screen">
      <TitleBar />
      <div className="flex-1 flex items-center justify-center bg-background">
        <Switch>
          <Route
            path="/"
            component={() => (
              <main className="flex-grow text-primary p-6">
                <h1 className="text-2xl font-bold">
                  Welcome to the app, {user ? user.username : "stranger"}!
                </h1>
              </main>
            )}
          />
          <Route path="/signup" component={SignUp} />
          <Route path="/login" component={Login} />
          <Route
            path="*"
            component={() => (
              <main className="flex-grow text-primary p-6">
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
