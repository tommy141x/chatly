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
