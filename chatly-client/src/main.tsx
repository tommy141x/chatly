import React, { Component, ErrorInfo } from "react";
import ReactDOM from "react-dom/client";
import { DevError, ProdError } from "@/components/error";

// Error Boundary Component
class ErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = {
      hasError: false,
      error: new Error("An unknown error has occurred"),
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Render DevError or ProdError based on the environment
    if (import.meta.env.MODE === "development") {
      this.setState({ error });
    } else {
      this.setState({ error });
    }
    // No console logging here
  }

  componentDidUpdate(prevProps: { children: React.ReactNode }) {
    if (this.props.children !== prevProps.children) {
      this.setState({
        hasError: false,
        error: new Error("An unknown error has occurred"),
      });
    }
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
const renderApp = async () => {
  try {
    const { default: App } = await import("@/App");
    ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
      <ErrorBoundary>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </ErrorBoundary>,
    );
  } catch (error) {
    ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
      <React.StrictMode>
        {import.meta.env.MODE === "development" ? (
          <DevError error={error as Error} />
        ) : (
          <ProdError />
        )}
      </React.StrictMode>,
    );
  }
};

renderApp();
