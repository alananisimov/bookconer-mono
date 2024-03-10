import { adminProcedure, createTRPCRouter } from "../trpc";

export const statsRouter = createTRPCRouter({
  getList: adminProcedure.query(({ ctx }) => {
    return ctx.db.user.findMany();
  }),
  getStats: adminProcedure.query(async ({ ctx }) => {
    const bookCount = await ctx.db.book.findMany();
    const reviewCount = await ctx.db.review.findMany();
    return {
      bookCount,
      reviewCount,
    };
  }),
});
