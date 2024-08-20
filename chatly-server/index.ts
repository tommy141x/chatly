import server from "bunrest";
import initRoutes from "@/lib/router";
const app = server();

initRoutes(app);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
