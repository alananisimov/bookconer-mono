import {
  useState,
  type Dispatch,
  type SetStateAction,
  useCallback,
  useMemo,
} from "react";

import CartLayout from "./cart-sheet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/shared/ui/shadcn/card";
import { useCartStateStore, useCartStore } from "../../store";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { type Book } from "@acme/db";
import { toast } from "sonner";
import { getSession } from "next-auth/react";
import { useSignInModal } from "../utility/signin-modal";
import { cn, truncate } from "~/lib/utils";
import { useCheckout } from "../checkout/checkout-modal";
import { Button } from "~/components/shared/ui/shadcn/button";
import { ReloadIcon } from "@radix-ui/react-icons";
interface CartItemType extends Book {
  quantity: number;
}
type CartItemProps = {
  item: CartItemType;
  onRemove: (id: string) => void;
  onAdd: (value: CartItemType) => void;
  close: Dispatch<SetStateAction<boolean>> | ShowModalFunction;
};
type ShowModalFunction = (show: boolean) => void;
function CartModal({
  showCartModal,
  setShowCartModal,
}: {
  showCartModal: boolean;
  setShowCartModal: Dispatch<SetStateAction<boolean>> | ShowModalFunction;
}) {
  const { items, add, delete: remove } = useCartStore();
  const { setShowSignInModal } = useSignInModal();
  const [isLoading, setLoading] = useState(false);

  const totalAmount = useMemo(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

  const handleUnauthenticated = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.error("Пожалуйста, войдите в аккаунт, чтобы продолжить покупки", {
      position: "top-right",
    });
    setShowCartModal(false);
    setShowSignInModal(true);
  }, [setShowCartModal, setShowSignInModal]);

  const { setShowCheckoutModal } = useCheckout();
  const handleAuthenticated = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setShowCartModal(false);
    setShowCheckoutModal(true);
  }, [setShowCartModal, setShowCheckoutModal]);
  const handleCheckout = useCallback(async () => {
    if (isLoading || items.length === 0) return;

    setLoading(true);

    try {
      const session = await getSession();
      if (!session) {
        await handleUnauthenticated();
      } else {
        await handleAuthenticated();
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error(
        "Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте еще раз.",
      );
    } finally {
      setLoading(false);
    }
  }, [isLoading, items, handleUnauthenticated, handleAuthenticated]);

  return (
    <>
      <CartLayout showModal={showCartModal} setShowModal={setShowCartModal}>
        <div className=" flex h-full flex-col justify-between">
          <div>
            <div className=" flex flex-col items-center justify-center space-y-3  border-b px-4 py-6 pt-8 text-center md:px-16">
              <h3 className="font-display text-2xl font-bold">Ваша корзина</h3>
              <p className="text-sm text-gray-500">
                Посмотрите что вы по-навыбирали
              </p>
            </div>

            <div className=" flex flex-col gap-4  py-8  sm:px-4">
              {items.at(0) ? (
                items.map((item) => {
                  return (
                    <CartItem
                      item={item}
                      onAdd={add}
                      onRemove={remove}
                      key={item.id}
                      close={setShowCartModal}
                    />
                  );
                })
              ) : (
                <EmptyCart />
              )}
            </div>
          </div>
          <div className="pb-4" id="data">
            <div className="left-0 w-full py-4 text-sm text-neutral-500 dark:text-neutral-400">
              <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                <p>Доставка</p>
                <p className="text-right">Будет расчитана позже</p>
              </div>
              <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                <p>Всего</p>
                <p className="text-right text-base text-black dark:text-white">
                  {totalAmount}
                  <span className="ml-1 inline">RUB</span>
                </p>
              </div>
            </div>
            {items.at(0) === undefined ? (
              <Button disabled className="w-full">
                Продолжить оформление
              </Button>
            ) : isLoading ? (
              <Button disabled className="w-full">
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Подождите
              </Button>
            ) : (
              <Button className="w-full" onClick={() => handleCheckout()}>
                Продолжить оформление
              </Button>
            )}
            <Button
              variant={"ghost"}
              className="mt-2 w-full"
              onClick={() => setShowCartModal(false)}
            >
              Вернуться к покупкам
            </Button>
          </div>
        </div>
      </CartLayout>
    </>
  );
}

function EmptyCart() {
  return (
    <Card>
      <CardContent>
        <CardHeader className="pb-0">
          <CardTitle>Корзина пуста</CardTitle>
          <CardDescription>Добавьте что нибудь сюда</CardDescription>
        </CardHeader>
      </CardContent>
    </Card>
  );
}

function CartItem({ item, onRemove, onAdd, close }: CartItemProps) {
  const canAdd = item.amount > item.quantity;
  return (
    <>
      <div
        key={item.id}
        className="relative flex w-full justify-between overflow-auto rounded-lg border p-4 dark:hover:bg-white/5"
      >
        <Link
          className="z-30 flex flex-row space-x-4"
          href={`/${item.id}`}
          onClick={() => close(false)}
        >
          <div className="relative h-16 w-16 cursor-pointer rounded-sm border">
            <Image
              alt={item.title}
              src={item.image_link}
              height={64}
              className="h-full w-full object-contain opacity-0 transition-opacity duration-500"
              onLoad={(image) =>
                image.currentTarget.classList.remove("opacity-0")
              }
              width={64}
            />
          </div>
          <div className="flex w-fit flex-1 flex-col text-base">
            <span className=" line-clamp-3 leading-tight sm:max-w-full">
              {truncate(item.title, 20)}
            </span>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {item.genre}
            </p>
          </div>
        </Link>
        <div className="flex h-16 flex-col justify-between">
          <p className="flex justify-end space-y-2 text-right text-sm">
            {item.price * item.quantity}
            <span className="ml-1 inline">RUB</span>
          </p>
          <div className="ml-auto flex h-9 flex-row items-center rounded-full border border-neutral-200 dark:border-neutral-700">
            <button
              aria-label="Reduce item quantity"
              aria-disabled="false"
              className="ease ml-auto flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full px-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80"
              onClick={() => onRemove(item.id)}
            >
              <Minus className={cn("h-4 w-4")} />
            </button>
            <p aria-live="polite" className="sr-only" role="status"></p>
            <p className="w-6 text-center">
              <span className="text-sm">{item.quantity}</span>
            </p>
            <button
              aria-label="Increase item quantity"
              aria-disabled="false"
              disabled={!canAdd}
              className={cn(
                "ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full px-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80",
                !canAdd && " cursor-not-allowed",
              )}
              onClick={() => onAdd(item)}
            >
              <Plus
                className={cn(
                  "h-4 w-4",
                  canAdd
                    ? "text-neutral-500 dark:text-neutral-300"
                    : "text-neutral-300 dark:text-neutral-500",
                )}
              />
            </button>

            <p aria-live="polite" className="sr-only" role="status"></p>
          </div>
        </div>
      </div>
    </>
  );
}

export function useCart() {
  const { setShowCart, showCart } = useCartStateStore();
  const CartModalCallback = useCallback(() => {
    return (
      <CartModal showCartModal={showCart} setShowCartModal={setShowCart} />
    );
  }, [showCart, setShowCart]);

  return useMemo(
    () => ({ setShowCartModal: setShowCart, CartModal: CartModalCallback }),
    [setShowCart, CartModalCallback],
  );
}
