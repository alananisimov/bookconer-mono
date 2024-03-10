import { adminProcedure, createTRPCRouter } from "../trpc";

export const userRouter = createTRPCRouter({
  getList: adminProcedure.query(({ ctx }) => {
    return ctx.db.user.findMany();
  }),
});
