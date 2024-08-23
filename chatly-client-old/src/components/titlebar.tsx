import React, { useState } from "react";
import { Minus, X, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentWindow } from "@tauri-apps/api/window";
import isTauri, { isTauriDesktop } from "@/components/isTauri";

let titleBarComponents = [];
let setTitleBarComponentsState = null;

export function setTitleBar(component) {
  if (setTitleBarComponentsState) {
    setTitleBarComponentsState([component]);
  } else if (titleBarComponents == []) {
    titleBarComponents.push(component);
  }
}

export function getTitleBar() {
  return titleBarComponents;
}

function TitleBar() {
  const [components, setComponents] = useState(titleBarComponents);
  setTitleBarComponentsState = setComponents;

  let appWindow;
  if (isTauriDesktop) {
    appWindow = getCurrentWindow();
  }

  const handleMinimize = () => appWindow.minimize();
  const handleMaximize = () => appWindow.toggleMaximize();
  const handleClose = () => appWindow.close();

  return (
    <div
      className="sticky top-0 z-50 h-9 w-full flex items-center justify-between text-primary bg-muted"
      data-tauri-drag-region
    >
      <div className="flex items-center">
        {components.map((Component, index) => (
          <React.Fragment key={index}>{Component}</React.Fragment>
        ))}
      </div>
      {isTauriDesktop && (
        <div className="flex pointer-events-auto">
          <Button
            variant="ghost"
            className="hover:bg-primary/10 rounded-none"
            size="icon"
            onClick={handleMinimize}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            className="hover:bg-primary/10 rounded-none"
            size="icon"
            onClick={handleMaximize}
          >
            <Square className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            className="hover:bg-destructive rounded-none"
            size="icon"
            onClick={handleClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
}

export default TitleBar;
