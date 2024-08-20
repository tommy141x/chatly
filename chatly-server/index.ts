import { initDB, softWipeDB, wipeDB } from "@/lib/db";
import server from "bunrest";
import initRoutes from "@/lib/router";

const app = server();

//await softWipeDB();
await wipeDB();
await initDB();
initRoutes(app);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
