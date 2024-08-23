import * as React from "react";
import { StatusBar } from "expo-status-bar";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogFooter,
  AlertDialogBody,
} from "@/components/ui/alert-dialog";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { TitleBar } from "@/components/titlebar";
import { View } from "react-native";
import { userState } from "@/lib/user";
import { sessionState } from "@/lib/session";
import { validateUser } from "@/lib/utils";
import { Redirect } from "expo-router";

export default function App() {
  const [showAlertDialog, setShowAlertDialog] = React.useState(false);
  let session = sessionState.get();
  if (!session) {
    return <Redirect href="/login" />;
  }

  const handleClose = () => setShowAlertDialog(false);
  return (
    <View className="flex-1 flex items-center justify-center bg-background-0">
      <Button onPress={() => setShowAlertDialog(true)}>
        <ButtonText>Open Dialog</ButtonText>
      </Button>
      <AlertDialog isOpen={showAlertDialog} onClose={handleClose} size="md">
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading className="text-typography-950 font-semibold" size="md">
              Are you sure you want to delete this post?
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody className="mt-3 mb-4">
            <Text size="sm">
              Deleting the post will remove it permanently and cannot be undone.
              Please confirm if you want to proceed.
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter className="">
            <Button
              variant="outline"
              action="secondary"
              onPress={handleClose}
              size="sm"
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button size="sm" onPress={handleClose}>
              <ButtonText>Delete</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <StatusBar style="auto" />
    </View>
  );
}
