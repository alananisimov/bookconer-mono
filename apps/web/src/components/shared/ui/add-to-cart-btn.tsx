"use client";
import { ReloadIcon } from "@radix-ui/react-icons";
import { type HTMLProps, useState } from "react";
import { useCartStore } from "~/store";
import { Button } from "~/components/shared/ui/shadcn/button";
import { type Book } from "@acme/db";
import { useCart } from "../../cart/cart";

interface Args extends HTMLProps<HTMLDivElement> {
  book: Book;
}

export default function AddToCartBtn({ book, ...props }: Args) {
  const [isLoading, setLoading] = useState(false);
  const { add, items } = useCartStore();
  const { setShowCartModal } = useCart();
  const bookQuantity = items.find((item) => item.id === book.id)?.quantity;
  const canAdd = book.amount > (bookQuantity ?? 0);
  const maxQuantityReached = bookQuantity === book.amount;

  async function handleClick() {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    add(book);
    setShowCartModal(true);
    setLoading(false);
  }

  return (
    <div {...props}>
      {isLoading ? (
        <Button disabled className="w-full">
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          Подождите
        </Button>
      ) : (
        <Button
          className="w-full"
          onClick={() => handleClick()}
          disabled={!canAdd}
        >
          {maxQuantityReached
            ? "В корзине макс. кол-во"
            : canAdd
              ? "Добавить в корзину"
              : "Нет в наличии"}
        </Button>
      )}
    </div>
  );
}
