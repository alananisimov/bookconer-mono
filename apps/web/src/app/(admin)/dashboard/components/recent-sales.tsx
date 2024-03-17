import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/shared/ui/shadcn/avatar";
import { api } from "~/trpc/server";

export async function RecentSales() {
  const orders = await api.order.getLastFive.query();
  return (
    <div className=" space-y-8">
      {orders.map((order) =>
        order.orderBook.map((book) => (
          <div
            className="flex flex-col sm:flex-row sm:justify-center"
            key={book.id}
          >
            <div className="flex flex-row truncate">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={book.book.image_link}
                  alt="Avatar"
                  className="object-contain"
                />
                <AvatarFallback>OM</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {book.book.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  Кол-во: {book.quantity}
                </p>
              </div>
            </div>
            <div className="mt-2 font-medium sm:ml-auto sm:mt-0">
              +<span>{book.book.price * book.quantity}</span> RUB
            </div>
          </div>
        )),
      )}
    </div>
  );
}
