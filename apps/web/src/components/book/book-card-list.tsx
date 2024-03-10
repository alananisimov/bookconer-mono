"use client";
import { type Book } from "@acme/db";
import { useSelectedBookStore } from "../../store";
import BookCard from "./book-card";

export default function BookList({ books }: { books: Book[] }) {
  const { bookName } = useSelectedBookStore();
  console.log(bookName);
  const filteredBooks = bookName
    ? books.filter((book) => book.title === bookName)
    : books;
  return (
    <>
      {filteredBooks.map((book) => {
        return (
          <div key={book.id}>
            <BookCard book={book} />
          </div>
        );
      })}
    </>
  );
}
