"use client";
import { Delete } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/shared/ui/shadcn/alert-dialog";
import { api } from "~/trpc/react";

export function DeleteBookDialog({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const action = api.book.delete.useMutation({
    onSuccess: () => {
      toast("Книга успешно удалена!");
      router.refresh();
    },
    onError: (e) => {
      toast.error(`${e.message}`);
    },
  });
  const deletion = api.book.deleteImage.useMutation({});
  function DeleteBook({ name }: { name: string }) {
    const parts = name.split("/");
    const filename = parts[parts.length - 1];
    const filenameParts = filename!.split("-");
    const finalFilename = filenameParts.join("-");
    const req = deletion.mutate({ name: finalFilename });
    console.log(req);
    action.mutate({ id });
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-black/5 focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:hover:bg-white/10">
          Удалить <Delete className="ml-auto h-4 w-4" />
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ты точно уверен?</AlertDialogTitle>
          <AlertDialogDescription>
            Это действие нельзя отменить. Все данные о книге будут удалены
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отменить</AlertDialogCancel>
          <AlertDialogAction onClick={() => DeleteBook({ name })}>
            Продолжить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
