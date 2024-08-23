import { navigate, Link } from "@/lib/router";
import store from "@/lib/store";
import { useState } from "state-pool";
import { Button } from "@/components/ui/button";
import { initEngine, prompt } from "@/lib/llm";
import { logout } from "@/lib/client";

function Server() {
  const [user, setUser] = store.useState("user");

  const testLLM = async () => {
    console.log("Initializing LLM Engine...");
    await initEngine();
    console.log("LLM Engine Initialized.");
    console.log("Prompting user for input...");
    const result = await prompt("What is your name?");
    console.log(result);
  };

  return (
    <div className="flex h-full gap-5">
      <div className="w-1/4 bg-secondary rounded-3xl"></div>
      <div className="w-3/4 bg-secondary flex flex-col items-center justify-center gap-5 text-primary p-6 rounded-3xl">
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
        <Button
          onClick={async () => {
            await testLLM();
          }}
        >
          Test LLM
        </Button>
      </div>
    </div>
  );
}

export default Server;
