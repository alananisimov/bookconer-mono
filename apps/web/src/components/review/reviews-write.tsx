"use client";
import { StarIcon } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/shared/ui/shadcn/avatar";
import { TypographyP } from "../shared/ui/typography/p";
import { Textarea } from "~/components/shared/ui/shadcn/textarea";

import { Button } from "~/components/shared/ui/shadcn/button";
import { type Session } from "next-auth";
import { cn } from "~/lib/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/shared/ui/shadcn/form";
import { type Book } from "@acme/db";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useState } from "react";

const formSchema = z.object({
  content: z
    .string()
    .min(2, { message: "Текст отзыва должен быть больше 2 символов" })
    .max(500, { message: "Текст отзыва не может быть больше 500 символов" }),
  rating: z.number().min(1),
});
function Loading() {
  return (
    <Button disabled className="ml-auto w-fit">
      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
      Подождите
    </Button>
  );
}
export default function WriteReview({
  session,
  book,
}: {
  session: Session | null;
  book: Book;
}) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      rating: 1,
    },
  });
  const [isLoading, setLoading] = useState(false);
  if (!session) return;

  const create = api.review.create.useMutation({
    onSuccess: () => {
      toast.success("Успешно создан отзыв");
      router.refresh();
    },
    onError(error) {
      toast.error(error.message);
      router.refresh();
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    await create.mutateAsync({ ...values, bookId: book.id });
  }

  return (
    <div className=" gap-4" role="form">
      <div className="flex gap-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid w-full gap-2"
          >
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem className="ml-auto">
                  <FormControl>
                    <StarRating
                      value={field.value}
                      onChange={field.onChange}
                      isLoading={isLoading}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10 border">
                <AvatarImage
                  alt="@shadcn"
                  src={session?.user.image ?? "/avatars/01.png"}
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="grid w-full gap-0.5 text-sm">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="w-full flex-1">
                      <FormControl>
                        <TypographyP className="break-all text-sm leading-loose text-gray-500 dark:text-gray-400">
                          <Textarea placeholder="Текст отзыва" {...field} />
                        </TypographyP>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className=" flex flex-row gap-0.5">
              {isLoading ? (
                <Loading />
              ) : (
                <Button className="ml-auto w-fit">Отправить</Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
function StarRating({
  value,
  onChange,
  isLoading,
}: {
  value: number;
  isLoading: boolean;
  onChange: (...event: unknown[]) => void;
}) {
  return (
    <div className="inline-flex">
      {Array.from({ length: 5 }).map((_, index) => (
        <button key={index} type="button" disabled={isLoading}>
          <StarIcon
            className={cn(
              "h-5 w-5 cursor-pointer",
              index < value
                ? "fill-primary"
                : "fill-muted stroke-muted-foreground",
            )}
            onClick={() => onChange(index + 1)}
          />
        </button>
      ))}
    </div>
  );
}
