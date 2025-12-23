"use client";

import { useStickyState } from "./sticky-state";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";

export default function FirefoxNotice() {
  const [accepted, setAccepted] = useStickyState<boolean>(
    false,
    "firefoxNoticeAccepted"
  );
  const isFirefox = navigator.userAgent.toLowerCase().includes("firefox");
  const showNotice = isFirefox && !accepted;
  return (
    <AlertDialog open={showNotice}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Firefox Notice</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          <p>
            It appears that you are using firefox, please note that firefox may
            not render some CSS on this website as intended. I recommend using
            chrome or a chromium-based browser. This is not a bug that can cause
            the website not to work, it just doesn't look the best. Feel free to
            stay on firefox if you want.
          </p>
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogAction asChild>
            <Button onClick={() => setAccepted(true)}>
              Accept and Continue
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
