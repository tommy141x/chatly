import React, { useState, useRef, useEffect } from "react";
import { View } from "react-native";
import { Minus, X, Square } from "lucide-react-native";
import { Pressable, PressableProps } from "react-native";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { isDesktop } from "@/lib/utils";

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
  const titleBarRef = useRef(null);

  let appWindow;
  if (isDesktop) {
    appWindow = getCurrentWindow();
  }

  useEffect(() => {
    if (titleBarRef.current && isDesktop) {
      titleBarRef.current.setAttribute("data-tauri-drag-region", "");
    }
  }, []);

  const handleMinimize = () => appWindow.minimize();
  const handleMaximize = () => appWindow.toggleMaximize();
  const handleClose = () => appWindow.close();

  return (
    <View
      ref={titleBarRef}
      className={`sticky top-0 h-9 w-full flex flex-row justify-between ${
        isDesktop ? "bg-card !z-[999]" : "bg-transparent"
      }`}
    >
      <View className="flex items-center">
        {components.map((Component, index) => (
          <React.Fragment key={index}>{Component}</React.Fragment>
        ))}
      </View>
      {isDesktop && (
        <View className="flex flex-row pointer-events-auto">
          <Pressable
            variant="primary"
            className="bg-card text-foreground items-center justify-center hover:bg-accent h-9 w-9 rounded-none"
            onPress={handleMinimize}
          >
            <Minus className="p-0" />
          </Pressable>
          <Pressable
            variant="primary"
            className="bg-card text-foreground items-center justify-center hover:bg-accent h-9 w-9 rounded-none"
            onPress={handleMaximize}
          >
            <Square className="p-0.5" />
          </Pressable>
          <Pressable
            variant="ghost"
            className="bg-card text-foreground items-center justify-center hover:bg-red-700 h-9 w-9 rounded-none"
            onPress={handleClose}
          >
            <X className="p-0" />
          </Pressable>
        </View>
      )}
    </View>
  );
}

export { TitleBar };
