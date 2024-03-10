"use client";
import { type Book } from "@acme/db";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "~/store";
import { Badge } from "~/components/shared/ui/shadcn/badge";
import { Button } from "~/components/shared/ui/shadcn/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "~/components/shared/ui/shadcn/card";
import { Label } from "~/components/shared/ui/shadcn/label";
import { AspectRatio } from "~/components/shared/ui/shadcn/aspect-ratio";
import useMediaQuery from "~/lib/hooks/use-media-query";
import Link from "next/link";
import MyImage from "../shared/widgets/image";
import { useCart } from "../cart/cart";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../shared/ui/shadcn/tooltip";

export default function BookCard({ book }: { book: Book }) {
  const { add, delete: remove, items } = useCartStore();

  const { setShowCartModal } = useCart();
  const { isMobile } = useMediaQuery();
  const bookQuantity = items.find((item) => item.id === book.id)?.quantity;
  function addToCart(book: Book) {
    if (bookQuantity && book.amount <= bookQuantity) {
      toast(`У нас в наличии только ${book.amount} такие книги`);
      return false;
    }
    add(book);
    return true;
  }
  return (
    <div>
      <Card className="w-full sm:max-w-md">
        <CardContent className="flex flex-col justify-center gap-y-6 pt-6">
          <div className="px-4 py-1 ">
            {isMobile ? (
              <Link href={`/${book.id}`}>
                <MyImage
                  alt="Product Image"
                  height={180}
                  src={book.image_link}
                  width={400}
                  className="mx-auto h-full max-h-64 w-auto  rounded-lg object-contain"
                />
              </Link>
            ) : (
              <Link href={`/${book.id}`}>
                <AspectRatio ratio={1 / 1}>
                  <MyImage
                    alt="Product Image"
                    height={180}
                    src={book.image_link}
                    width={400}
                    className=" h-full w-auto rounded-lg object-cover"
                  />
                </AspectRatio>
              </Link>
            )}
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <h2 className=" line-clamp-2 w-fit text-lg font-medium">
                  {book.title}
                </h2>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {book.title} - {book.author}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardContent>

        <CardFooter className="flex flex-col gap-y-3">
          <div className="flex w-full justify-between">
            <h4 className=" font-semibold md:text-lg">{book.price} РУБ</h4>
            <div>
              {book.amount > 0 ? (
                <Badge variant={"secondary"}>{book.amount} в наличии</Badge>
              ) : (
                <Badge variant={"secondary"}>Нет в наличии</Badge>
              )}
            </div>
          </div>
          <div className="mx-auto mt-2 flex w-full flex-row items-center gap-x-3 ">
            {book.amount > 0 ? (
              bookQuantity && bookQuantity > 0 ? (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => remove(book.id)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Label>{bookQuantity}</Label>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => addToCart(book)}
                    disabled={book.amount <= bookQuantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Button
                  className="w-full"
                  variant={"outline"}
                  onClick={() =>
                    addToCart(book) === true && setShowCartModal(true)
                  }
                >
                  Добавить в корзину
                </Button>
              )
            ) : (
              <Button variant={"outline"} disabled className="w-full">
                Нет в наличии
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
