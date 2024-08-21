import { useEffect } from "react";
import { useState } from "state-pool";
import { Button } from "@/components/ui/button";
import { navigate } from "@/lib/router";
import { validateUser, logout } from "@/lib/client";
import store from "@/lib/store";
import axios from "axios";

function Dashboard() {
  const [server] = store.useState("server");
  const [user, setUser] = store.useState("user");

  useEffect(() => {
    const fetchUserData = async () => {
      let user = await validateUser();
      if (user) {
        setUser(user);
      } else {
        navigate("/login");
      }
    };

    fetchUserData();
  }, []);

  return (
    <main className="flex flex-col items-center gap-5 text-primary p-6">
      <h1 className="text-2xl font-bold">
        Welcome {user?.display_name || "Stranger"}.
      </h1>
      <Button
        onClick={async () => {
          await logout();
          navigate("/login");
        }}
      >
        Logout
      </Button>
    </main>
  );
}

export default Dashboard;
