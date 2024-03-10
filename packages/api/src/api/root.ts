import { createTRPCRouter } from "./trpc";
import { bookRouter } from "./routers/book";
import { reviewRouter } from "./routers/review";
import { userRouter } from "./routers/user";
import { statsRouter } from "./routers/stats";
import { orderRouter } from "./routers/order";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  book: bookRouter,
  review: reviewRouter,
  user: userRouter,
  stats: statsRouter,
  order: orderRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
