import BookPage from "~/components/book/book-page";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/shared/ui/shadcn/card";
import { api } from "~/trpc/server";

function NotFound() {
  return (
    <Card className="mx-auto max-w-sm">
      <CardContent className="-mb-6">
        <CardHeader>
          <CardTitle>Не найдено</CardTitle>
          <CardDescription>Попробуйте поискать по-другому</CardDescription>
        </CardHeader>
      </CardContent>
    </Card>
  );
}

export default async function Page({ params }: { params: { id: string } }) {
  const book = await api.book.getById.query({ id: params.id });
  return (
    <main className=" mx-auto flex max-w-screen-xl flex-col gap-y-6 pt-32 sm:px-8 xl:px-0">
      {book ? <BookPage book={book} /> : <NotFound />}
    </main>
  );
}
