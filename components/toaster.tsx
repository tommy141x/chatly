import { Toaster as WebToaster, toast as webToast } from "sonner";
import { Toaster as NativeToaster, toast as nativeToast } from "sonner-native";
import { isMobile } from "@/lib/utils";
import { ReactNode } from "react";

// This component is a wrapper which uses sonner-web or sonner-native based on the platform

// Type definitions to handle both web and native props
type CommonToastOptions = {
  duration?: number;
  icon?: ReactNode;
  description?: string;
  className?: string;
  style?: Record<string, any>;
  onDismiss?: (toast: any) => void;
  onAutoClose?: (toast: any) => void;
  action?:
    | {
        label: string;
        onClick: () => void;
      }
    | ReactNode;
};

type WebSpecificOptions = {
  unstyled?: boolean;
  classNames?: {
    toast?: string;
    title?: string;
    description?: string;
    actionButton?: string;
    cancelButton?: string;
    closeButton?: string;
  };
  cancel?:
    | {
        label: string;
        onClick: () => void;
      }
    | ReactNode;
  position?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
};

type NativeSpecificOptions = {
  toastOptions?: {
    style?: Record<string, any>;
    className?: string;
  };
  position?: "top-center" | "bottom-center";
};

type ToastOptions = CommonToastOptions &
  (WebSpecificOptions | NativeSpecificOptions);

// Create unified toast function
const toast = Object.assign(
  (message: string | ReactNode, options?: ToastOptions) => {
    if (isMobile) {
      return nativeToast(message, options as any);
    }
    return webToast(message, options as any);
  },
  {
    success: (message: string | ReactNode, options?: ToastOptions) => {
      if (isMobile) {
        return nativeToast.success(message, options as any);
      }
      return webToast.success(message, options as any);
    },
    error: (message: string | ReactNode, options?: ToastOptions) => {
      if (isMobile) {
        return nativeToast.error(message, options as any);
      }
      return webToast.error(message, options as any);
    },
    warning: (message: string | ReactNode, options?: ToastOptions) => {
      if (isMobile) {
        return nativeToast.warning(message, options as any);
      }
      return webToast.warning(message, options as any);
    },
    promise: <T,>(
      promise: Promise<T>,
      options: {
        loading: string;
        success: string | ((data: T) => string);
        error: string;
      },
    ) => {
      if (isMobile) {
        return nativeToast.promise(promise, options);
      }
      return webToast.promise(promise, options);
    },
    loading: (message: string, options?: ToastOptions) => {
      if (isMobile) {
        return nativeToast.loading(message, options as any);
      }
      return webToast.loading(message, options as any);
    },
    custom: (render: (id: string) => ReactNode, options?: ToastOptions) => {
      if (isMobile) {
        return nativeToast(render("" + Date.now()), options as any);
      }
      return webToast.custom(render, options as any);
    },
    dismiss: (toastId: string) => {
      if (isMobile) {
        return nativeToast.dismiss(toastId);
      }
      return webToast.dismiss(toastId);
    },
    wiggle: (toastId: string) => {
      if (isMobile) {
        return nativeToast.wiggle(toastId);
      }
      // Web version doesn't have wiggle, so we'll just do nothing
      return;
    },
  },
);

// Unified Toaster component
const Toaster = ({
  toastOptions,
  position,
  expand,
  visibleToasts,
  dir,
  icons,
  ...props
}: {
  toastOptions?: any;
  position?: string;
  expand?: boolean;
  visibleToasts?: number;
  dir?: "ltr" | "rtl";
  icons?: Record<string, ReactNode>;
  [key: string]: any;
}) => {
  if (isMobile) {
    return (
      <NativeToaster
        position={position as "top-center" | "bottom-center"}
        toastOptions={toastOptions}
        {...props}
      />
    );
  }

  return (
    <WebToaster
      position={
        position as
          | "top-left"
          | "top-center"
          | "top-right"
          | "bottom-left"
          | "bottom-center"
          | "bottom-right"
      }
      expand={expand}
      visibleToasts={visibleToasts}
      dir={dir}
      icons={icons}
      toastOptions={toastOptions}
      {...props}
    />
  );
};

export { Toaster, toast };
