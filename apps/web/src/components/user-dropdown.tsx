"use client";

import { type HTMLProps, useState } from "react";
import { type Session } from "next-auth";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/shared/ui/shadcn/avatar";
import { ModeToggle } from "./utility/mode-toggle";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./shared/ui/shadcn/dropdown-menu";
import SignOutBtn from "~/app/(admin)/dashboard/components/ui/sign-out";

interface Args extends HTMLProps<HTMLDivElement> {
  session: Session;
}

export default function UserDropdown({ session, ...props }: Args) {
  const { image, name, email, isAdmin } = session.user;
  const [isOpenPopover, setIsPopoverOpen] = useState(false);

  return (
    <div className=" flex flex-row text-left " {...props}>
      {/* <div className="flex flex-row p-2">
                <div className="flex-col">
                  {name && (
                    <p className="truncate text-sm font-medium ">{name}</p>
                  )}
                  <p className="truncate text-sm text-gray-500">{email}</p>
                </div>
                <ModeToggle className="ml-auto" />
              </div>
              <Link href={"/my"}>
                <button className="relative flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all hover:bg-black/5 dark:hover:bg-white/10">
                  <LayoutDashboard className="h-4 w-4" />
                  <p className="text-sm">Личный кабинет</p>
                </button>
              </Link>
              {session.user.isAdmin && (
                <Link
                  href={"/dashboard"}
                  className="relative flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all hover:bg-black/5 dark:hover:bg-white/10"
                >
                  <BarChart className="h-4 w-4" />
                  <p className="text-sm">Админ-панель</p>
                </Link>
              )}
              <button
                className="relative flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all hover:bg-black/5 dark:hover:bg-white/10"
                onClick={() => signOut()}
              >
                <LogOut className="h-4 w-4" />
                <p className="text-sm">Выйти</p>
              </button> */}

      <DropdownMenu open={isOpenPopover} onOpenChange={setIsPopoverOpen}>
        <DropdownMenuTrigger asChild>
          <button onClick={() => setIsPopoverOpen((value) => !value)}>
            <Avatar className="h-8 w-8">
              <AvatarImage
                alt="avatar"
                src={
                  image ??
                  "https://api.dicebear.com/7.x/pixel-art-neutral/svg?backgroundColor=b6e3f4,c0aede,d1d4f9"
                }
              />
              <AvatarFallback>{"BC"}</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent sideOffset={8} align="end" className="w-64">
          <DropdownMenuLabel className="font-normal">
            <div className="inline-flex w-full justify-between">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {email}
                </p>
              </div>
              <ModeToggle className="ml-auto" />
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Link href={"/my"}>
              <DropdownMenuItem>
                Личный кабинет
                <DropdownMenuShortcut>⌘M</DropdownMenuShortcut>
              </DropdownMenuItem>
            </Link>
            {isAdmin && (
              <Link href={"/dashboard"}>
                <DropdownMenuItem>
                  Админ-панель
                  <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                </DropdownMenuItem>
              </Link>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <SignOutBtn />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
