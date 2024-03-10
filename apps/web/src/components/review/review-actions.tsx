"use client";

import { type Review } from "@acme/db";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/shared/ui/shadcn/button";
import { api } from "~/trpc/react";

function Loading() {
  return (
    <Button disabled size={"sm"}>
      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
      Подождите
    </Button>
  );
}
export default function ReviewActions({ review }: { review: Review }) {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);

  const remove = api.review.delete.useMutation({
    onSuccess: () => {
      toast.success("Успешно удален отзыв");
      router.refresh();
    },
    onError(error) {
      toast.error(error.message);
      router.refresh();
    },
  });
  if (isLoading) return <Loading />;
  return (
    <Button
      size={"sm"}
      className="w-fit"
      onClick={async () => {
        setLoading(true);
        await remove.mutateAsync({ id: review.id });
      }}
    >
      Удалить
    </Button>
  );
}
