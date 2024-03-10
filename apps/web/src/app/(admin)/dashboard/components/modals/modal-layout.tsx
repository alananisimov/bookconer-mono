"use client";

import { type HTMLAttributes, type Dispatch, type SetStateAction } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerOverlay,
  DrawerTitle,
} from "~/components/shared/ui/shadcn/drawer";
import { ScrollArea } from "~/components/shared/ui/shadcn/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/shared/ui/shadcn/sheet";
import useMediaQuery from "~/lib/hooks/use-media-query";
import { cn } from "~/lib/utils";
type ShowModalFunction = (show: boolean) => void;
interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  showModal: boolean;
  description?: string;
  setShowModal: Dispatch<SetStateAction<boolean>> | ShowModalFunction;
}
export default function DashboardModal({
  children,
  showModal,
  title,
  description,
  setShowModal,
  ...props
}: ModalProps) {
  const { isMobile } = useMediaQuery();

  if (isMobile) {
    return (
      <Drawer open={showModal} onOpenChange={setShowModal}>
        <DrawerOverlay className=" bg-transparent" />
        <DrawerContent className={cn(props.className, "h-[calc(100dvh-64px)]")}>
          <ScrollArea className="mt-4 h-full rounded-sm">
            <DrawerHeader>
              <DrawerTitle>{title}</DrawerTitle>
              <DrawerDescription>{description}</DrawerDescription>
            </DrawerHeader>
            {children}
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }
  return (
    <Sheet open={showModal} onOpenChange={setShowModal}>
      <SheetContent
        {...props}
        className={cn(props.className, "max-h-screen overflow-y-auto")}
      >
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
}
