import { type ChangeEvent, useCallback, useMemo, useState } from "react";
import { useCreateBookModalStore } from "~/store";
import { Button } from "~/components/shared/ui/shadcn/button";
import { Input } from "~/components/shared/ui/shadcn/input";
import { cn } from "~/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { generateReactHelpers } from "@uploadthing/react/hooks";
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
import { type OurFileRouter } from "@acme/api/src/uploadthing";
import { imageFile } from "~/lib/validators";
import DashboardModal from "./modal-layout";
import { Textarea } from "~/components/shared/ui/shadcn/textarea";
const FormSchema = z.object({
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
function CreateBook({
  showCreateModal,
  setShowCreateModal,
}: {
  showCreateModal: boolean;
  setShowCreateModal: (show: boolean) => void;
}) {
  const { useUploadThing } = generateReactHelpers<OurFileRouter>();
  const { startUpload } = useUploadThing("imageUploader");

  const createBook = api.book.create.useMutation({
    onSuccess: () => {
      toast("Книга успешно добавлена!");
      setShowCreateModal(false);
      router.refresh();
    },
    onError: (e) => {
      toast.error(`${e.message}`);
    },
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "Моя прекрасная книга",
      description: "Ооочень длинное и интересное описание...",
      price: 2,
      author: null,
      image_link: null,
      genre: "Жанр книги",
      amount: 0,
    },
  });
  const router = useRouter();
  const [fileLink, setFileLink] = useState<File | null>(null);
  const [submitClicked, setSubmitClicked] = useState(false);
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!fileLink) {
      toast.warning("Выберите файл изображения!");
      return;
    }
    setSubmitClicked(true);
    const fileExtension = fileLink.name.split(".").pop();
    const fileName = `${data.title}.${fileExtension}`;
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
      return;
    }

    const req = createBook.mutate({ ...data, image_link: image.url });
    console.log(req);
  }

  return (
    <DashboardModal
      showModal={showCreateModal}
      setShowModal={setShowCreateModal}
      title="Добавить книгу"
      className=""
      description="Тут вы можете добавить книгу"
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
            name={"author"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Автор (необязательно)</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
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
                <FormLabel>Изображение</FormLabel>
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
                    accept=".jpg,.jpeg,.png,.webp"
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
              <>Добавить книгу</>
            )}
          </Button>
        </form>
      </Form>
    </DashboardModal>
  );
}
export function useCreateBookModal() {
  const { setShowCreateModal, showCreateModal } = useCreateBookModalStore();

  const EditBookCallback = useCallback(() => {
    return (
      <CreateBook
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
      />
    );
  }, [setShowCreateModal, showCreateModal]);

  return useMemo(
    () => ({
      setShowCreateModal,
      CreateBookModal: EditBookCallback,
    }),
    [EditBookCallback, setShowCreateModal],
  );
}
