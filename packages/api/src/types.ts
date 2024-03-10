import { type User, type Book, type Review } from "@acme/db";

export type ReviewWithUser = Review & {
  createdBy: User;
};

export type BookWithReviews = Book & {
  Review: ReviewWithUser[];
};
