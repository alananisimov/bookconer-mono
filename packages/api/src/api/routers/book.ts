import { type Book } from "@acme/db";
import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc";
import { type BookWithReviews } from "../../types";
import { utapi } from "../../uploadthing";

// Define the book schema
const bookSchema = z.object({
  title: z.string().min(1).max(150),
  description: z.string().min(1),
  image_link: z.string(),
  price: z.number().min(1),
  author: z.string().nullable().default(null),
  genre: z.string(),
  amount: z.number(),
});

// Extend the book schema with an ID field
const bookSchemaWithId = bookSchema.extend({
  id: z.string().min(1),
});

export const bookRouter = createTRPCRouter({
  // Create endpoint
  create: adminProcedure
    .input(bookSchema)
    .mutation(async ({ ctx, input }): Promise<Book> => {
      return ctx.db.book.create({
        data: {
          ...input,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  // Delete endpoint
  delete: adminProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }): Promise<Book> => {
      return ctx.db.book.delete({
        where: {
          id: input.id,
        },
      });
    }),

  // Update endpoint
  update: adminProcedure
    .input(bookSchemaWithId)
    .mutation(async ({ ctx, input }): Promise<Book> => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.book.update({
        where: {
          id: input.id,
        },
        data: input,
      });
    }),

  // Get list endpoint
  getList: publicProcedure.query(({ ctx }) => {
    return ctx.db.book.findMany({

    });
  }),

  // Get by ID endpoint
  getById: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }): Promise<BookWithReviews | null> => {
      return await ctx.db.book.findUnique({
        where: {
          id: input.id,
        },
        include: {
          Review: {
            include: {
              createdBy: true,
            },
          },
        },

      });
    }),

  // Delete image endpoint
  deleteImage: adminProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ input }): Promise<{ success: boolean }> => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return await utapi.deleteFiles(input.name);
    }),
});
