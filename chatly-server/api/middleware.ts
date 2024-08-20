export default function middleware(req, res, next) {
  // Set CORS headers to allow all origins
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  console.log(
    JSON.stringify({
      method: req.method,
      url: req.request.url,
      query: req.query,
      params: req.params,
      body: req.body,
      cache: req.headers["cache-control"],
      agent: req.headers["user-agent"],
      connection: req.headers.connection,
    }),
  );

  next();
}
