import { useEffect } from "react";
import { useState } from "state-pool";
import { Button } from "@/components/ui/button";
import Server from "@/components/server";
import SideBar from "@/components/sidebar";
import { navigate } from "@/lib/router";
import { validateUser, logout } from "@/lib/client";
import { setTitleBar } from "@/components/titlebar";
import store from "@/lib/store";
import axios from "axios";

function Dashboard() {
  const [server] = store.useState("server");
  const [user, setUser] = store.useState("user");

  useEffect(() => {
    const fetchUserData = async () => {
      setTitleBar(
        <div className="m-5">
          <h1 className="font-bold">{server.name}</h1>
        </div>,
      );
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
    <main className="flex h-[95%] w-[97%] gap-5">
      <div className="w-[90px] h-full flex items-center justify-center">
        <SideBar />
      </div>
      <div className="flex-1 h-full">
        <Server />
      </div>
    </main>
  );
}

export default Dashboard;
