"use client";
import { signOut } from "next-auth/react";
import {
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "~/components/shared/ui/shadcn/dropdown-menu";

export default function SignOutBtn() {
  return (
    <DropdownMenuItem onClick={() => signOut()}>
      Выйти
      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
    </DropdownMenuItem>
  );
}
