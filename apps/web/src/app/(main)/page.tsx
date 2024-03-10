import { api } from "~/trpc/server";
import BookList from "../../components/book/book-card-list";
import Banner from "../../components/banner";

export default async function Home() {
  const books = await api.book.getList.query();
  return (
    <main className=" mx-auto flex max-w-screen-xl flex-col gap-y-6 px-3 pt-32 sm:px-8 xl:px-0">
      <div className="">
        <Banner />
      </div>

      <div className=" grid w-full grid-cols-1 flex-col gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <BookList books={books} />
      </div>
    </main>
  );
}
