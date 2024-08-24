import React from "react";
import { View } from "react-native";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "@/components/ui/actionsheet";
import { Grid, GridItem } from "@/components/ui/grid";
import { Heading } from "@/components/ui/heading";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { isMobile } from "@/lib/utils";

export const Dialog = ({
  isOpen,
  onClose,
  snapPoints = [95],
  children,
  ...props
}) => {
  if (isMobile) {
    return (
      <Actionsheet
        isOpen={isOpen}
        onClose={onClose}
        snapPoints={snapPoints}
        {...props}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent className="px-10 flex flex-col h-full">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          {children}
        </ActionsheetContent>
      </Actionsheet>
    );
  } else {
    return (
      <AlertDialog isOpen={isOpen} onClose={onClose}>
        <AlertDialogBackdrop />
        <AlertDialogContent {...props} className="!rounded-2xl">
          {children}
        </AlertDialogContent>
      </AlertDialog>
    );
  }
};

export const DialogHeader = ({ children, ...props }) => {
  if (isMobile) {
    return <View {...props}>{children}</View>;
  } else {
    return <AlertDialogHeader {...props}>{children}</AlertDialogHeader>;
  }
};

export const DialogContent = ({ children, ...props }) => {
  if (isMobile) {
    return (
      <View className="w-full" {...props}>
        {/*Adding flex-1 here shoots the dialog footer off into the void */}
        {children}
      </View>
    );
  } else {
    return <AlertDialogBody {...props}>{children}</AlertDialogBody>;
  }
};

export const DialogFooter = ({ children, ...props }) => {
  if (isMobile) {
    return (
      <View className="w-full flex gap-2" {...props}>
        {children}
      </View>
    );
  } else {
    return <AlertDialogFooter {...props}>{children}</AlertDialogFooter>;
  }
};
