import { useEffect } from "react";
import TitleBar from "@/components/titlebar";
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
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background">
      <TitleBar>
        <DropdownMenu className="bg-transparent">
          <DropdownMenuTrigger asChild className="!ring-0">
            <Button variant="ghost" className="hover:bg-primary/10 p-2">
              <p className="font-bold">Chatly</p>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="border-none">
            <DropdownMenuItem>Copy</DropdownMenuItem>
            <DropdownMenuItem>Paste</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TitleBar>
      <main className="flex-grow text-primary p-6">
        <h1 className="text-2xl font-bold">
          {isTauriDesktop ? "This is the desktop" : "This is the browser"}
        </h1>
      </main>
    </div>
  );
}

export default App;
