import { Minus, X, Square } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { getCurrentWindow } from "@tauri-apps/api/window";
import isTauri, { isTauriDesktop } from "@/components/isTauri";

function TitleBar({ children }) {
  let appWindow;
  if (isTauriDesktop) {
    appWindow = getCurrentWindow();
  }

  const handleMinimize = () => appWindow.minimize();
  const handleMaximize = () => appWindow.toggleMaximize();
  const handleClose = () => appWindow.close();
  const handleTitleBarDrag = async () => {
    if (isTauriDesktop) {
      try {
        await appWindow.startDragging();
      } catch (err) {
        console.error("Error starting drag:", err);
      }
    }
  };

  return (
    <div
      className="flex items-center justify-between text-primary bg-muted"
      data-tauri-drag-region
    >
      <div className="flex items-center">{children}</div>
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
