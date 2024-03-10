import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/shared/ui/shadcn/card";
import Image from "next/image";
import { type Order } from "@acme/db";
import { type OrderWithBooks } from "@acme/api";
import OrderInfoModal from "./order-info-modal";
import { Button } from "~/components/shared/ui/shadcn/button";
import { Truck } from "lucide-react";
import Link from "next/link";

export default function Order({
  order,
  index,
}: {
  order: OrderWithBooks;
  index: number;
}) {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-x-2">
          Заказ #{index}
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ({order.status})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-start gap-4">
        <div className="flex w-full flex-col justify-between gap-y-2 sm:flex-row ">
          {order.orderBook.map((orderedBook) => (
            <Link key={orderedBook.id} href={`/${orderedBook.bookId}`}>
              <div className="flex flex-row items-center gap-2">
                <Image
                  alt="Book cover"
                  className="aspect-[1/1] rounded-lg object-contain"
                  height="100"
                  src={orderedBook.book.image_link}
                  width="100"
                />
                <div>
                  <h3 className="text-base font-medium sm:text-xl">
                    {orderedBook.book.title}
                  </h3>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    от {orderedBook.book.author}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Количество: {orderedBook.quantity}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Примерная дата доставки
          </div>
          <div className="font-semibold">25 Марта, 2024</div>
        </div>
      </CardContent>
      <CardFooter>
        <OrderInfoModal
          trigger={
            <Button size="sm" className="gap-x-2">
              <Truck className="h-4 w-4" /> Отслеживать заказ
            </Button>
          }
        />
      </CardFooter>
    </Card>
  );
}
