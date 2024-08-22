import { navigate, Link } from "@/lib/router";
import Image from "@/components/ui/image";
import store from "@/lib/store";
import { useState } from "state-pool";

function SideBar() {
  return (
    <div className="bg-secondary rounded-3xl h-full w-full flex flex-col items-center justify-start">
      <Image
        src="https://mir-s3-cdn-cf.behance.net/project_modules/disp/ca5d4f138939351.6274c569dd1b6.gif"
        className="w-14 h-14 mx-auto rounded-full mt-4"
      />
      <img
        src="https://cdn2.fatsoma.com/media/W1siZiIsInB1YmxpYy8yMDIzLzUvMjQvOS8yMi80OC81MjIvVW50aXRsZWQgKDMpLnBuZyJdXQ"
        className="w-14 h-14 mx-auto rounded-full mt-4"
      />
      <img
        src="https://forum-cfx-re.akamaized.net/original/4X/3/3/c/33c8a46bd7dc62a1f44a6b492f6d854ae6e97822.png"
        className="w-14 h-14 mx-auto rounded-full mt-4"
      />
    </div>
  );
}

export default SideBar;
