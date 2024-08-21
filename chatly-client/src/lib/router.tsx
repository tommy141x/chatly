import React from "react";
import {
  Route as OriginalRoute,
  Switch as OriginalSwitch,
  Link as OriginalLink,
  useRoute,
  useLocation,
} from "wouter";
import { navigate as originalNavigate } from "wouter/use-browser-location";
import { AnimatePresence, motion } from "framer-motion";

// Transition wrapper component
const PageTransition = ({ children, location }) => (
  <motion.div
    key={location}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.div>
);

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
        return <Component />;
      }
    };

    // Execute the middleware function
    const result = middleware ? middleware(next, location) : next();
    // If middleware returns a component or navigation URL, render it; otherwise, call next()
    return result || next();
  }
  return null;
};

export const Switch = ({ children, ...props }) => {
  const [location] = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition location={location}>
        <OriginalSwitch {...props}>{children}</OriginalSwitch>
      </PageTransition>
    </AnimatePresence>
  );
};

export const Link = ({ children, ...props }) => (
  <OriginalLink {...props}>{children}</OriginalLink>
);

export const navigate = originalNavigate;
