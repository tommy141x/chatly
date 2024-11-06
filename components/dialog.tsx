import React from "react";
import { View, Text } from "react-native";
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
import { isMobile, isWindowSmall } from "@/lib/utils";

export const Dialog = ({
  isOpen,
  onClose,
  snapPoints = [70],
  children,
  ...props
}) => {
  if (isMobile || isWindowSmall()) {
    return (
      <Actionsheet
        isOpen={isOpen}
        onClose={onClose}
        snapPoints={snapPoints}
        {...props}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent className="w-full h-full">
          <ActionsheetDragIndicatorWrapper className="w-full h-full flex flex-col">
            <ActionsheetDragIndicator className="!w-28 !h-2" />
            <View className="w-full h-full flex mt-4">{children}</View>
          </ActionsheetDragIndicatorWrapper>
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
    return <View {...props}>{children}</View>;
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
