"use client";

import { type Dispatch, type SetStateAction } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/shared/ui/shadcn/sheet";
import useMediaQuery from "~/lib/hooks/use-media-query";
import { cn } from "~/lib/utils";
type ShowModalFunction = (show: boolean) => void;
export default function CartLayout({
  children,
  className,
  showModal,
  setShowModal,
  title,
  description,
}: {
  children: React.ReactNode;
  className?: string;
  showModal: boolean;
  title?: string;
  description?: string;
  setShowModal: Dispatch<SetStateAction<boolean>> | ShowModalFunction;
}) {
  const { isMobile } = useMediaQuery();

  if (isMobile) {
    return (
      <Sheet open={showModal} onOpenChange={setShowModal}>
        <SheetContent
          className={cn(className, "h-full w-screen overflow-auto ")}
        >
          <SheetTrigger>
            <button />
          </SheetTrigger>
          {title && (
            <SheetHeader>
              <SheetTitle>{title}</SheetTitle>
              <SheetDescription>{description}</SheetDescription>
            </SheetHeader>
          )}
          {children}
        </SheetContent>
      </Sheet>
    );
  }
  return (
    <Sheet open={showModal} onOpenChange={setShowModal}>
      <SheetContent className={cn(className, " sm:max-w-md", " overflow-auto")}>
        {title && (
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription>{description}</SheetDescription>
          </SheetHeader>
        )}
        {children}
      </SheetContent>
    </Sheet>
  );
}
