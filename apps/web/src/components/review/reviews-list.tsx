/* eslint-disable react/no-unescaped-entities */
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/shared/ui/shadcn/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/shared/ui/shadcn/card";
import { Separator } from "~/components/shared/ui/shadcn/separator";
import { type ReviewWithUser } from "@acme/api";
import { StarIcon } from "~/components/shared/icons/star-icon";
import { getServerAuthSession } from "@acme/api";
import { TypographyH3 } from "../shared/ui/typography/h3";
import ReviewsWrite from "./reviews-write";
import { api } from "~/trpc/server";
import { type Book } from "@acme/db";
import ReviewActions from "./review-actions";

function NoReviews() {
  return (
    <Card className="max-w-sm">
      <CardContent className="-mb-6">
        <CardHeader>
          <CardTitle>Не найдено отзывов</CardTitle>
          <CardDescription>Станьте первым!</CardDescription>
        </CardHeader>
      </CardContent>
    </Card>
  );
}

export default async function ReviewsList({
  reviews,
  book,
}: {
  reviews: ReviewWithUser[];

  book: Book;
}) {
  const session = await getServerAuthSession();

  async function canAdd() {
    if (!session) return false;
    const [orders, myReview] = await Promise.all([
      api.order.getList.query(),
      api.review.getMy.query(),
    ]);
    const hasBookInOrders = orders.some((order) =>
      order.orderBook.some((orderedBook) => orderedBook.book.id === book.id),
    );
    const hasReview = myReview.some((review) => review.bookId === book.id);
    return hasBookInOrders && !hasReview;
  }

  // Если книги нет в заказах, возвращаем сообщение

  return (
    <div>
      <div className="grid w-full gap-4">
        {reviews.length !== 0 ? (
          reviews.map((review) => (
            <div key={review.id} className=" gap-4">
              <div className="flex gap-4">
                <Avatar className="h-10 w-10 border">
                  <AvatarImage
                    alt="@shadcn"
                    src={review.createdBy.image ?? "/avatars/01.png"}
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="grid w-full">
                  <div className="mb-4 flex items-start gap-4">
                    <div className="grid gap-0.5 text-sm">
                      <h3 className="font-semibold">{review.createdBy.name}</h3>
                      <time className="text-sm text-gray-500 dark:text-gray-400">
                        {(() => {
                          const today = new Date();
                          const creationDate = new Date(review.createdAt);
                          const differenceInTime =
                            today.getTime() - creationDate.getTime();
                          const differenceInDays = Math.floor(
                            differenceInTime / (1000 * 3600 * 24),
                          );
                          if (differenceInDays === 0) return "сегодня";
                          return `${differenceInDays} дня назад`;
                        })()}
                      </time>
                    </div>
                    <div className="ml-auto flex items-center gap-0.5">
                      {Array.from({ length: review.rating }, (_, index) => (
                        <StarIcon
                          key={index}
                          className="h-5 w-5 fill-primary"
                        />
                      ))}
                      {Array.from({ length: 5 - review.rating }, (_, index) => (
                        <StarIcon
                          key={index}
                          className="h-5 w-5 fill-muted stroke-muted-foreground"
                        />
                      ))}
                    </div>
                  </div>

                  <p className="break-all text-sm leading-loose text-gray-500 dark:text-gray-400">
                    {review.content}
                  </p>
                  {review.createdById === session?.user.id && (
                    <div className="ml-auto">
                      <ReviewActions review={review} />
                    </div>
                  )}
                </div>
              </div>
              <Separator className="my-6" />
            </div>
          ))
        ) : (
          <NoReviews />
        )}
        {(await canAdd()) && (
          <div className="mt-16 flex flex-col">
            <TypographyH3>Ваш отзыв</TypographyH3>
            <ReviewsWrite session={session} book={book} />
          </div>
        )}
      </div>
    </div>
  );
}
