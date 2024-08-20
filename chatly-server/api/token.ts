export default function handler(app, route) {
  app.get(route, (req, res) => {
    res.send("Hello World - Get Request to /api/token");
  });
}
