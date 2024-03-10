"use client";

import * as React from "react";
import { Button } from "~/components/shared/ui/shadcn/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "~/components/shared/ui/shadcn/command";
import { cn } from "~/lib/utils";
import { type Book } from "@acme/db";
import { useRouter } from "next/navigation";
import {
  GearIcon,
  PersonIcon,
  ReaderIcon,
  ArchiveIcon,
} from "@radix-ui/react-icons";
import { toast } from "sonner";
import { useSignInModal } from "./utility/signin-modal";
import { getSession } from "next-auth/react";
interface Args {
  books: Book[];
  className?: string;
}
export function SearchBar({ books, className }: Args) {
  const [open, setOpen] = React.useState(false);

  // const fuse = new Fuse(books, { keys: ["title"] });

  // const handleSearch = (query: string) => {
  //   if (!query) {
  //     setSearchResults(books);
  //     return;
  //   }

  //   const results = fuse.search(query);
  //   setSearchResults(results.map((result) => result.item));
  // };
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }

        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "relative w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:w-64 sm:pr-12",
          className,
        )}
        onClick={() => setOpen(true)}
      >
        <span className="hidden sm:inline-flex">Поиск по магазину...</span>
        <span className="inline-flex sm:hidden">Поиск...</span>
        <kbd className=" pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <SearchDialog open={open} setOpen={setOpen} books={books} />
    </>
  );
}
function SearchDialog({
  open,
  setOpen,
  books,
}: {
  open: boolean;
  books: Book[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const books_values = books.map((el) => {
    return { value: el.title, label: el.title, id: el.id };
  });
  const { setShowSignInModal } = useSignInModal();

  const handleCabinet = async () => {
    const session = await getSession();
    if (!session?.user) {
      toast.error(
        "Пожалуйста, войдите в аккаунт, чтобы зайти в личный кабинет",
        {
          position: "top-right",
        },
      );
      setOpen(false);
      setShowSignInModal(true);
      return;
    }
    router.replace("/my");
  };
  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false);
      command();
    },
    [setOpen],
  );
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Введите команду или выполните поиск.." />
      <CommandList>
        <CommandEmpty>Ничего не найдено.</CommandEmpty>
        <CommandGroup heading="Книги">
          {books_values.map((book) => (
            <CommandItem
              key={book.value}
              value={book.value}
              onSelect={() =>
                runCommand(() => {
                  router.push(`/${book.id}`);
                  setOpen(false);
                })
              }
            >
              <ReaderIcon className="mr-2 h-3 w-3" />
              <span>{book.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Аккаунт">
          <CommandItem onClick={() => handleCabinet()}>
            <PersonIcon className="mr-2 h-3 w-3" />
            <span>Профиль</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>

          <CommandItem onClick={() => handleCabinet()}>
            <ArchiveIcon className="mr-2 h-3 w-3" />
            <span>Мои заказы</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>

          <CommandItem onClick={() => handleCabinet()}>
            <GearIcon className="mr-2 h-3 w-3" />
            <span>Настройки</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
