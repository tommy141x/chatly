import { useEffect, useRef } from "react";
import { navigate, Link } from "@/lib/router";
import Image from "@/components/ui/image";
import store from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HousePlus, MessageCircleMore } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "@/components/ui/animated-modal";
import { useState } from "state-pool";
import axios from "axios";

function SideBar() {
  const [server, setServer] = store.useState("server");
  const [user, setUser] = store.useState("user");
  const [session, setSession] = store.useState("session");

  const [serverName, setServerName] = useState("");
  const [serverBio, setServerBio] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const createServer = async () => {
    try {
      const response = await axios.post(
        `${server.url}/api/server`,
        {
          name: serverName,
          bio: serverBio,
        },
        {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        },
      );

      // Handle successful server creation
      console.log("Server created:", response.data);
      setIsOpen(false); // Close the modal
      // You might want to update the UI or navigate to the new server
    } catch (error) {
      console.error("Failed to create server:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  return (
    <div className="bg-secondary rounded-3xl h-full w-full gap-4 flex flex-col items-center justify-start pt-4">
      <Button variant="outline" className="w-14 h-14 rounded-full">
        <MessageCircleMore className="h-14 w-14 text-primary" />
      </Button>
      <Image
        src="https://mir-s3-cdn-cf.behance.net/project_modules/disp/ca5d4f138939351.6274c569dd1b6.gif"
        className="w-14 h-14 mx-auto rounded-full pointer-events-none"
      />

      <Modal open={isOpen} onOpenChange={setIsOpen}>
        <ModalTrigger asChild>
          <div className="bg-background hover:bg-primary/10 transition duration-150 flex items-center justify-center w-14 h-14 rounded-full">
            <HousePlus className="h-7 w-7 text-primary" />
          </div>
        </ModalTrigger>
        <ModalBody className="text-primary">
          <ModalContent>
            <h2 className="text-lg font-semibold mb-4">Create a New Server</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="serverName">Server Name</Label>
                <Input
                  id="serverName"
                  value={serverName}
                  onChange={(e) => setServerName(e.target.value)}
                  placeholder="Enter server name"
                />
              </div>
              <div>
                <Label htmlFor="serverBio">Server Bio</Label>
                <Input
                  id="serverBio"
                  value={serverBio}
                  onChange={(e) => setServerBio(e.target.value)}
                  placeholder="Enter server bio"
                />
              </div>
            </div>
          </ModalContent>
          <ModalFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createServer}>Create Server</Button>
          </ModalFooter>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default SideBar;
