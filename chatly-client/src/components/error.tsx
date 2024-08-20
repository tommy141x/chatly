import React from "react";
import Zut from "@jundao/zut";
import TitleBar from "@/components/titlebar";
import "@/styles/globals.css";

// Create a React component that wraps the Zut instance
const ZutWrapper: React.FC<{ error: any }> = ({ error }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (containerRef.current) {
      new Zut(error, containerRef.current);
    }
  }, [error]);

  return <div ref={containerRef} />;
};

// This component renders the TitleBar and ZutWrapper
export const DevError: React.FC<{ error: any }> = ({ error }) => {
  document.documentElement.classList.add("dark");
  return (
    <div className="flex flex-col h-screen">
      <TitleBar />
      <div className="flex-1 flex items-center justify-center bg-[#0b0c0c]">
        <ZutWrapper error={error} />
      </div>
    </div>
  );
};

export const ProdError = () => {
  document.documentElement.classList.add("dark");
  return (
    <div className="flex flex-col h-screen">
      <TitleBar />
      <div className="flex-1 flex items-center justify-center bg-[#0b0c0c]">
        <div className="text-white text-2xl">
          Something completely fucking broke 😭
        </div>
      </div>
    </div>
  );
};
