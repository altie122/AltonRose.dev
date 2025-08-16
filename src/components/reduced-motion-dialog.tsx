import * as AlertDialog from "./ui/alert-dialog";
import { useReducedMotion } from "motion/react";
import { useStickyState, StickyStateProvider } from "./sticky-state"; // Import Provider
import { Button } from "./ui/button";
import { useEffect, type ReactNode } from "react";

type ReducedMotionDialogEnum =
  | "no-motion"
  | "less-motion"
  | "all-the-motion"
  | "no-motion-unchecked";

export function useReducedMotionState() {
  return useStickyState<ReducedMotionDialogEnum>(
    "no-motion-unchecked",
    "prefersReducedMotion"
  );
}

export function ReducedMotionProvider({ children }: { children: ReactNode }) {
  return (
    <StickyStateProvider<ReducedMotionDialogEnum>
      keyName='prefersReducedMotion'
      defaultValue='no-motion-unchecked'
    >
      {children}
    </StickyStateProvider>
  );
}

export function ReducedMotionDialog() {
  const prefersReducedMotionBrowser = useReducedMotion();
  const [prefersReducedMotion, setPrefersReducedMotion] =
    useReducedMotionState();
  useEffect(() => {
    if (
      !prefersReducedMotionBrowser &&
      prefersReducedMotion === "no-motion-unchecked"
    ) {
      setPrefersReducedMotion("all-the-motion");
    }
  }, [
    prefersReducedMotionBrowser,
    prefersReducedMotion,
    setPrefersReducedMotion,
  ]);

  const openDialog =
    prefersReducedMotion === "no-motion-unchecked" &&
    prefersReducedMotionBrowser;

  if (!openDialog) {
    return null;
  }

  return (
    <AlertDialog.AlertDialog open={openDialog}>
      <AlertDialog.AlertDialogContent>
        <AlertDialog.AlertDialogHeader>
          <AlertDialog.AlertDialogTitle>
            Continue using reduced motion?
          </AlertDialog.AlertDialogTitle>
          <AlertDialog.AlertDialogDescription>
            Your browser has indicated that you are using reduced motion, this
            site has a lot of details that use a lot of motion.
            <br />
            The site will continue to work without motion, although it is highly
            recommended. You will{" "}
            <em>
              <b>NOT</b>
            </em>{" "}
            be able to change this later unless you clear local storage.
          </AlertDialog.AlertDialogDescription>
        </AlertDialog.AlertDialogHeader>
        <AlertDialog.AlertDialogFooter>
          <AlertDialog.AlertDialogAction asChild>
            <Button
              variant={"outline"}
              onClick={() => setPrefersReducedMotion("no-motion")}
            >
              No Motion
            </Button>
          </AlertDialog.AlertDialogAction>
          <AlertDialog.AlertDialogAction asChild>
            <Button
              variant={"outline"}
              onClick={() => setPrefersReducedMotion("less-motion")}
            >
              Less Motion
            </Button>
          </AlertDialog.AlertDialogAction>
          <AlertDialog.AlertDialogAction asChild>
            <Button
              variant={"outline"}
              onClick={() => setPrefersReducedMotion("all-the-motion")}
            >
              All the Motion
            </Button>
          </AlertDialog.AlertDialogAction>
        </AlertDialog.AlertDialogFooter>
      </AlertDialog.AlertDialogContent>
    </AlertDialog.AlertDialog>
  );
}
