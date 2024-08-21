export default function middleware(req, res, next) {
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
