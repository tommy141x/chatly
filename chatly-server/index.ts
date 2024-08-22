import { initDB, softWipeDB, wipeDB } from "@/lib/db";
import server from "bunrest";
import initRoutes from "@/lib/router";

const app = server();

//await softWipeDB();
await wipeDB();
await initDB();
initRoutes(app);

app.listen(process.env.PORT, () => {
  console.log("Listening on port " + process.env.PORT);
});

app.ws<{ str: string }>(
  (ws, msg) => {
    // here to handle incoming message
    ws.send(msg);
    // get web socket data
    console.log(ws.data);
  },
  {
    open: (ws) => {
      console.log("Websocket is turned on");
    },
    close: (ws) => {
      console.log("Websocket is closed");
    },
    drain: (ws) => {
      console.log("Websocket is drained");
    },
  },
  (req) => ({ str: "socket-data" }),
);
