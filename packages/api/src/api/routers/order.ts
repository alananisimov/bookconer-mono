import { type Order, type Book } from "@acme/db";
import { adminProcedure, createTRPCRouter, protectedProcedure } from "../trpc";

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
    }
  ),
  getLastFive: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.order.findMany({
      include: {
        user: true,
        orderBook: {
          include: {
            book: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });
  }),
});
