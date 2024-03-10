import { type Book } from "@acme/db";
import { type ChangeEvent, useCallback, useMemo, useState } from "react";
import { useEditBookStore } from "~/store";
import { Button } from "~/components/shared/ui/shadcn/button";
import { Input } from "~/components/shared/ui/shadcn/input";
import { cn } from "~/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/shared/ui/shadcn/form";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { LoadingDots } from "~/components/shared/icons";
import { imageFile } from "~/lib/validators";
import { generateReactHelpers } from "@uploadthing/react/hooks";
import { type OurFileRouter } from "@acme/api/src/uploadthing";
import DashboardModal from "./modal-layout";
import { Textarea } from "~/components/shared/ui/shadcn/textarea";
const FormSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(2, {
    message: "Название должно быть не менее 2 символов.",
  }),
  description: z
    .string()
    .max(999, { message: "Описание может быть максимум 999 символов" }),
  price: z.coerce
    .number()
    .min(1, {
      message: "Цена должна быть больше 0.",
    })
    .max(100000, { message: "Цена должна быть меньше 100000." }),
  author: z.string().nullable(),
  image_link: imageFile,
  genre: z
    .string()
    .min(1, { message: "У книги должен быть жанр" })
    .max(20, { message: "Жанр должен быть не больше 20 символов" }),
  amount: z.coerce
    .number()
    .min(0, { message: "У книги должна быть цена" })
    .max(199, { message: "У книги может быть максимально 199 экземпляров" }),
});
function EditBook({
  showEditModal,
  setShowEditModal,

  selectedBook,
}: {
  showEditModal: boolean;
  setShowEditModal: (show: boolean) => void;
  selectedBook: Book | null;
}) {
  const updateBook = api.book.update.useMutation({
    onSuccess: () => {
      toast("Успешно обновлена книга!");
      setShowEditModal(false);
      router.refresh();
    },
    onError: (e) => {
      toast.error(`${e.message}`);
    },
  });
  const [fileLink, setFileLink] = useState<File | null>(null);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      id: selectedBook?.id ?? "",
      title: selectedBook?.title ?? "",
      description: selectedBook?.description ?? "",
      price: selectedBook?.price ?? 0,
      image_link: null,
      author: selectedBook?.author ?? "",
      genre: selectedBook?.genre ?? "",
      amount: selectedBook?.amount ?? 0,
    },
  });
  const router = useRouter();
  const { useUploadThing } = generateReactHelpers<OurFileRouter>();
  const { startUpload } = useUploadThing("imageUploader");
  const [submitClicked, setSubmitClicked] = useState(false);
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setSubmitClicked(true);
    if (!fileLink) {
      await updateBook.mutateAsync({
        ...data,
        image_link: selectedBook!.image_link,
      });
      setSubmitClicked(false);
      return;
    }

    const fileExtension = fileLink.name.split(".").pop();
    const fileName = `${selectedBook?.title}.${fileExtension}`;
    const renamedFile = new File([fileLink], fileName, { type: fileLink.type });

    const image = await startUpload([renamedFile]).then((res) => {
      const formattedImage = res?.map((img) => ({
        url: img.url,
        id: img.key,
      }));
      return formattedImage?.at(0);
    });
    if (!image) {
      toast.error("Не удалось загрузить изображение");
      setSubmitClicked(false);
      return;
    }

    await updateBook.mutateAsync({
      ...data,
      image_link: image.url,
    });
    setSubmitClicked(false);
  }

  return (
    <DashboardModal
      showModal={showEditModal}
      setShowModal={setShowEditModal}
      title="Изменить книгу"
      description="Тут вы можете изменить выбранную книгу"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn("grid items-start gap-2 p-4")}
        >
          <FormField
            control={form.control}
            name={"title"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Название</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"description"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Описание</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"price"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Цена (в рублях)</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"image_link"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ссылка на изображение (временно)</FormLabel>
                <FormControl>
                  <Input
                    ref={field.ref}
                    onChange={async (e: ChangeEvent<HTMLInputElement>) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        console.log("Выбран файл:", file);
                        setFileLink(file);
                      }
                    }}
                    type="file"
                    accept=".jpg,.jpeg,.png"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"genre"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Жанр</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"author"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Автор</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"amount"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Количество</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={submitClicked}
            className={`${
              submitClicked && "cursor-not-allowed"
            } flex w-full items-center justify-center transition-all duration-75`}
            type="submit"
          >
            {submitClicked ? (
              <LoadingDots color="#808080" />
            ) : (
              <>Сохранить изменения</>
            )}
          </Button>
        </form>
      </Form>
    </DashboardModal>
  );
}
export function useEditBookModal() {
  const { showEditModal, setShowEditModal, selectedBook, setSelectedBook } =
    useEditBookStore();

  const EditBookCallback = useCallback(() => {
    return (
      <EditBook
        selectedBook={selectedBook}
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
      />
    );
  }, [showEditModal, setShowEditModal, selectedBook]);

  return useMemo(
    () => ({
      setShowEditModal,
      EditBookModal: EditBookCallback,
      setSelectedBook,
    }),
    [setShowEditModal, EditBookCallback, setSelectedBook],
  );
}
