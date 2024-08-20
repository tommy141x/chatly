import React, { Component, ErrorInfo } from "react";
import ReactDOM from "react-dom/client";
import { DevError, ProdError } from "@/components/error";

// Error Boundary Component
class ErrorBoundary extends Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = {
      hasError: false,
      error: new Error("An unknown error has occured"),
    };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state to indicate an error has occurred
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return import.meta.env.MODE === "development" ? (
        <DevError error={this.state.error} />
      ) : (
        <ProdError />
      );
    }

    return this.props.children;
  }
}

// Main render logic
(async () => {
  try {
    const App = await import("@/App");
    ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
      <ErrorBoundary>
        <React.StrictMode>
          <App.default />
        </React.StrictMode>
      </ErrorBoundary>,
    );
  } catch (error) {
    ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
      <React.StrictMode>
        {import.meta.env.MODE === "development" ? (
          <DevError error={error} />
        ) : (
          <ProdError />
        )}
      </React.StrictMode>,
    );
  }
})();
