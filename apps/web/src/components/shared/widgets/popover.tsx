"use client";

import {
  type HTMLAttributes,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

import useMediaQuery from "~/lib/hooks/use-media-query";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "~/components/shared/ui/shadcn/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/shadcn/dropdown-menu";

interface Args extends HTMLAttributes<HTMLDivElement> {
  _content: ReactNode | string;
  align?: "center" | "start" | "end";
  openPopover: boolean;
  setOpenPopover: Dispatch<SetStateAction<boolean>>;
  mobileOnly?: boolean;
}

export default function Popover({
  children,
  _content,
  align = "center",
  openPopover,
  setOpenPopover,
  ...props
}: Args) {
  const { isMobile } = useMediaQuery();

  if (isMobile) {
    return (
      <Drawer open={openPopover} onOpenChange={setOpenPopover}>
        <DrawerContent className="p-4">{_content}</DrawerContent>
        <DrawerTrigger>{children}</DrawerTrigger>
      </Drawer>
    );
  }

  return (
    <DropdownMenu open={openPopover} onOpenChange={setOpenPopover}>
      <DropdownMenuTrigger className="hidden sm:inline-flex" asChild>
        {children}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        sideOffset={8}
        align={align}
        {...props}
        className="w-64"
      >
        {_content}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
