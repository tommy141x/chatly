import {
  Route as OriginalRoute,
  Switch as OriginialSwitch,
  useRoute,
  useLocation,
} from "wouter";
import { navigate as originalNavigate } from "wouter/use-browser-location";
import { AnimatePresence, motion } from "framer-motion";

// Middleware Route Component with Framer Motion
export const Route = ({
  path,
  middleware,
  component: Component,
  animation,
}) => {
  const [match] = useRoute(path);
  const [location] = useLocation();

  if (match) {
    const next = (url) => {
      if (url) {
        // Navigate to the provided URL
        originalNavigate(url, { replace: true });
      } else {
        // Render the component if no URL is provided
        return (
          <AnimatePresence>
            <motion.div
              initial={animation?.initial || { opacity: 0 }}
              animate={animation?.animate || { opacity: 1 }}
              exit={animation?.exit || { opacity: 0 }}
            >
              <Component />
            </motion.div>
          </AnimatePresence>
        );
      }
    };

    // Execute the middleware function
    const result = middleware ? middleware(next, location) : next();

    // If middleware returns a component or navigation URL, render it; otherwise, call next()
    return result || next();
  }

  return null;
};

export const Switch = ({ children }) => (
  <OriginialSwitch>{children}</OriginialSwitch>
);

export const navigate = originalNavigate;
