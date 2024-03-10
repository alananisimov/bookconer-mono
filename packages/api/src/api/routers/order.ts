import { type Order, type Book } from "@acme/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export type OrderWithBooks = Order & {
  orderBook: {
    id: string;
    bookId: string;
    orderId: string;
    quantity: number;
    book: Book;
  }[];
};

export const orderRouter = createTRPCRouter({
  getList: protectedProcedure.query(
    async ({ ctx }): Promise<OrderWithBooks[]> => {
      return ctx.db.order.findMany({
        where: {
          userId: ctx.session.user.id,
        },
        include: {
          orderBook: {
            include: {
              book: true,
            },
          },
        },
      });
    },
  ),
});
