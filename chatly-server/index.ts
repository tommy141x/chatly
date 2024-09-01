import { initDB, softWipeDB, wipeDB } from "@/lib/db";
import server from "bunrest";
import initRoutes from "@/lib/router";
import { handleWS, wsHandlers } from "@/lib/websocket";

const app = server();

//await softWipeDB();
//await wipeDB();
//await initDB();
initRoutes(app);

app.ws<{ userId: string; locationId: number }>(handleWS, wsHandlers, (req) => {
  const userId = req.query.userId as string;
  const locationId = parseInt(req.query.locationId as string, 10);
  return { userId, locationId };
});

app.listen(process.env.PORT, () => {
  console.log("API is running");
});
