"use client";
import { type Book } from "@acme/db";
import { Suspense } from "react";
import MyImage from "~/components/shared/widgets/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/shared/ui/shadcn/card";
import { Skeleton } from "~/components/shared/ui/shadcn/skeleton";
import { truncate } from "~/lib/utils";

function Loading() {
  return (
    <div className="flex flex-col space-y-3">
      <div className="space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      <Skeleton className="h-[150px] w-full rounded-xl" />
    </div>
  );
}

export default function BookCard({ book }: { book: Book }) {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <div>
          <Card className="transition-opacity duration-500 ease-in-out">
            <CardContent>
              <CardHeader>
                <CardTitle>{truncate(book.title, 25)}</CardTitle>
                <CardDescription>
                  {truncate(book.description, 50)}
                </CardDescription>
              </CardHeader>

              <MyImage
                src={book.image_link}
                alt=""
                width={200}
                height={200}
                className="max-h-44 w-auto"
              />
            </CardContent>
          </Card>
        </div>
      </Suspense>
    </>
  );
}
