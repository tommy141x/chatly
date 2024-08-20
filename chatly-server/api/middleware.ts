export default function middleware(req, res, next) {
  console.log("Hello from middleware!");
  next();
}
