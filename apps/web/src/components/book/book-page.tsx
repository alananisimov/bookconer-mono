import { Separator } from "~/components/shared/ui/shadcn/separator";
import { cn } from "~/lib/utils";
import { type BookWithReviews } from "@acme/api";
import { StarIcon } from "~/components/shared/icons/star-icon";
import { api } from "~/trpc/server";
import AddToCartBtn from "../shared/ui/add-to-cart-btn";
import Description from "./book-page-description";
import MyImage from "../shared/widgets/image";
import { TypographyH3 } from "../shared/ui/typography/h3";
import dynamic from "next/dynamic";
import { Skeleton } from "../shared/ui/shadcn/skeleton";

function getRating(rating: number): string {
  if (rating === 0) return "Нет отзывов";
  if (rating > 0 && rating < 3.5) return "Нормально";
  if (rating >= 3.5 && rating < 4) return "Хорошо";
  if (rating >= 4) return "Отлично";
  return "";
}
const DynamicReviewList = dynamic(() => import("../review/reviews-list"), {
  loading: () => (
    <div className="flex w-full gap-4">
      <Skeleton className="h-10 w-10 rounded-full border" />
      <div className="grid w-full">
        <div className="mb-4 flex items-start gap-4">
          <div className="grid flex-1 gap-1 text-sm">
            <Skeleton className="h-5 max-w-32 font-semibold" />
            <Skeleton className="h-3 max-w-16 rounded-sm" />
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((e, i) => {
              return <Skeleton className="h-5 w-5 rounded-sm" key={i} />;
            })}
          </div>
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 max-w-[300px]" />
        </div>
      </div>
    </div>
  ),
});

export default async function BookPage({ book }: { book: BookWithReviews }) {
  const average = await api.review.getAverageRating.query({ id: book.id });
  return (
    <div className="flex max-w-6xl flex-col">
      <div
        key="1"
        className="mx-auto grid w-full grid-cols-1 justify-between gap-y-6 px-4 md:grid-cols-2 md:gap-x-10 md:px-6 lg:px-8 "
      >
        <div id="image" className="h-auto w-full">
          <MyImage
            src={book.image_link}
            alt=""
            width={400}
            height={300}
            priority
            loading="eager"
            className="h-auto max-h-[36rem] w-full rounded-sm object-contain"
          />
        </div>
        <div className="flex flex-col gap-6 md:gap-8 lg:gap-0" id="info">
          <div className=" flex flex-col gap-y-8">
            <div className="grid gap-2">
              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl md:font-bold">
                {book.title}
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Автор: {book.author}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1 text-sm">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <StarIcon
                    key={rating}
                    className={cn(
                      average > rating
                        ? "fill-primary"
                        : "fill-muted stroke-muted-foreground",
                      "h-5 w-5",
                    )}
                    aria-hidden="true"
                  />
                ))}

                <span className="ml-1 text-gray-500 dark:text-gray-400">
                  {average} ({getRating(average)})
                </span>
              </div>
            </div>
            <Description description={book.description} />
          </div>
          <div className="mt-auto">
            <div className="flex flex-col gap-2">
              <div className="text-3xl font-bold">{book.price} РУБ</div>

              <AddToCartBtn className="mt-2 sm:mt-0" book={book} />
            </div>
            <Separator className="mt-8 " />
          </div>
        </div>
      </div>
      <div className="mt-10 grid gap-4 px-4 md:px-6 lg:px-8">
        <div className="">
          <TypographyH3>Отзывы</TypographyH3>
        </div>

        <DynamicReviewList reviews={book.Review} book={book} />
      </div>
    </div>
  );
}
