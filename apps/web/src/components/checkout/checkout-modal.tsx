import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useMemo,
} from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useCartStore, useCheckoutStateStore } from "../../store";
import Modal from "../shared/widgets/modal";
import { z } from "zod";
import isCreditCard from "validator/lib/isCreditCard";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/shared/ui/shadcn/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "~/components/shared/ui/shadcn/input";
import { Button } from "~/components/shared/ui/shadcn/button";
import { cn } from "~/lib/utils";

import { AlertCircleIcon, CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/shared/ui/shadcn/popover";
import { Calendar } from "~/components/shared/ui/shadcn/calendar";
import { api } from "~/trpc/react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "~/components/shared/ui/shadcn/alert";
import { toast } from "sonner";
import { Skeleton } from "~/components/shared/ui/shadcn/skeleton";
type ShowModalFunction = (show: boolean) => void;
function CheckoutModal({
  showCheckoutModal,
  setShowCheckoutModal,
}: {
  showCheckoutModal: boolean;
  setShowCheckoutModal: Dispatch<SetStateAction<boolean>> | ShowModalFunction;
}) {
  return (
    <Modal
      showModal={showCheckoutModal}
      setShowModal={setShowCheckoutModal}
      title="Оформление"
      description="Заполните нужные данные для завершения процесса покупки!"
    >
      <ProfileForm />
    </Modal>
  );
}

export function useCheckout() {
  const { setShowCheckout, showCheckout } = useCheckoutStateStore();

  const CheckoutModalCallback = useCallback(() => {
    return (
      <CheckoutModal
        showCheckoutModal={showCheckout}
        setShowCheckoutModal={setShowCheckout}
      />
    );
  }, [showCheckout, setShowCheckout]);

  return useMemo(
    () => ({
      setShowCheckoutModal: setShowCheckout,
      CheckoutModal: CheckoutModalCallback,
    }),
    [setShowCheckout, CheckoutModalCallback],
  );
}

const formSchema = z.object({
  fullname: z.string().min(2, {
    message: "Фамилия должна быть минимум 2 символа",
  }),
  creditcard: z.string().refine(isCreditCard, {
    message: "Это должны быть валидные данные карты",
  }),
  cvv: z
    .string()
    .min(2, { message: "CVV должен быть минимум 2 символа" })
    .max(4, { message: "CVV должен быть максимум 4 символа" }),
  dob: z.date({
    required_error: "Должна быть дата окончания действия карты",
  }),
});

export function ProfileForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      creditcard: "",
      cvv: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast.success("Вы успешно прошли чекаут!");
    console.log(values);
  }
  const { items, delete: remove } = useCartStore();
  const totalAmount = useMemo(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);
  const { data, isLoading } = api.book.getList.useQuery();
  const canProceed = items.every((item) => {
    if (!data) return false;
    const book = data.find((book) => book.id === item.id);
    return book && book.amount >= item.quantity;
  });
  if (isLoading)
    return (
      <div className="flex flex-col space-x-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-8 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-8 w-full" />
          </div>
          <div className="grid grid-cols-2 gap-x-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
          <Skeleton className="mt-auto h-8 w-full "></Skeleton>
        </div>
      </div>
    );
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-1">
        {data &&
          items.map((item) => {
            const book = data.find((book) => book.id === item.id);

            if (!book || book.amount < item.quantity) {
              return (
                <Alert key={item.id}>
                  <AlertCircleIcon className="h-4 w-4" />
                  <AlertTitle>Изменение количества книг!</AlertTitle>
                  <AlertDescription className="flex flex-col">
                    Количество книг &quot;{item.title}&quot; изменилось c{" "}
                    {item.quantity} на {book?.amount} шт.
                    <Button
                      size={"sm"}
                      variant={"destructive"}
                      className="ml-auto mt-2"
                      type="button"
                      onClick={() =>
                        Array.from({ length: item.quantity }).map(() =>
                          remove(item.id),
                        )
                      }
                    >
                      Убрать из корзины
                    </Button>
                  </AlertDescription>
                </Alert>
              );
            }
          })}
        <FormField
          control={form.control}
          name="creditcard"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Данные карты</FormLabel>
              <FormControl>
                <Input
                  placeholder="4000 0200 0000 0000"
                  type="number"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fullname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имя и фамилия с с карты</FormLabel>
              <FormControl>
                <Input placeholder="Иван Иванов" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid w-full grid-cols-2 gap-x-2">
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "inline-flex w-full justify-between gap-x-2 pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                        type="button"
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: ru })
                        ) : (
                          <span>Дата окончания</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      locale={ru}
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date() || date > new Date("2035-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cvv"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="number"
                    max={999}
                    min={100}
                    placeholder="CVV"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          variant={"outline"}
          disabled={!canProceed}
        >
          Оплатить {totalAmount} RUB
        </Button>
      </form>
    </Form>
  );
}
