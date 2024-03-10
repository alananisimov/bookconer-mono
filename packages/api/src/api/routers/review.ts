import { type Review } from "@acme/db";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../trpc";

const reviewSchema = z.object({
  content: z.string().min(1),
  rating: z.number().min(1),
  bookId: z.string(),
});

export const reviewRouter = createTRPCRouter({
  create: protectedProcedure
    .input(reviewSchema)
    .mutation(async ({ ctx, input }): Promise<Review> => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return ctx.db.review.create({
        data: {
          ...input,
          createdById: ctx.session.user.id,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }): Promise<Review> => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return ctx.db.review.delete({
        where: {
          id: input.id,
        },
      });
    }),
  update: protectedProcedure
    .input(reviewSchema.merge(z.object({ id: z.string() })))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.review.update({
        where: {
          id: input.id,
        },
        data: {
          ...input,
          createdById: ctx.session.user.id,
        },
      });
    }),
  getMy: protectedProcedure.query(async ({ ctx }): Promise<Review[]> => {
    return ctx.db.review.findMany({
      where: {
        createdById: ctx.session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },

    });
  }),
  getList: publicProcedure.query(({ ctx }) => {
    return ctx.db.review.findMany({

    });
  }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }): Promise<Review | null> => {
      return ctx.db.review.findUnique({
        where: {
          id: input.id,
        },

      });
    }),
  getAverageRating: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }): Promise<number> => {
      const aggregations = await ctx.db.review.aggregate({
        _avg: {
          rating: true,
        },
        where: {
          bookId: input.id,
        },

      });
      const averageRating = aggregations._avg.rating;

      return averageRating ?? 0;
    }),
});
