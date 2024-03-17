import { type Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/shared/ui/shadcn/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/shared/ui/shadcn/tabs";
import { Overview } from "~/app/(admin)/dashboard/components/overview";
import { RecentSales } from "~/app/(admin)/dashboard/components/recent-sales";
import { Search } from "~/app/(admin)/dashboard/components/search";
import { UserNav } from "~/app/(admin)/dashboard/components/user-nav";
import { api } from "~/trpc/server";
import { Book, User } from "lucide-react";
import { BooksTable } from "./components/books-table";
import { ReviewsTable } from "./components/reviews-table";
import DownloadStatsBtn from "./components/ui/download-stats";

export const metadata: Metadata = {
  title: "Bookconer | Dashboard",
  description: "Example dashboard app built using the components.",
};

export default async function DashboardPage() {
  const books = await api.book.getList.query();
  const reviews = await api.review.getList.query();
  const users = await api.user.getList.query();

  return (
    <>
      <div className="flex flex-col">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <div className=" flex flex-1 flex-row items-center justify-between space-x-4">
              <Search />
              <UserNav />
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-4 pt-6 sm:p-8">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Главная</h2>
            <div className="flex items-center space-x-2">
              {/* TODO <CalendarDateRangePicker /> */}
              <DownloadStatsBtn />
            </div>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Статистика</TabsTrigger>
              <TabsTrigger value="books">Книги</TabsTrigger>
              <TabsTrigger value="reviews">Отзывы</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1  gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Количество книг
                    </CardTitle>

                    <Book className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{books.length} шт.</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Количество отзывов
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {reviews.length} шт.
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Количество пользователей
                    </CardTitle>

                    <User className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{users.length}</div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 w-full">
                  <CardHeader>
                    <CardTitle>Обзор</CardTitle>
                  </CardHeader>
                  <CardContent className="">
                    <Overview />
                  </CardContent>
                </Card>
                <Card className="col-span-4 sm:col-span-3">
                  <CardHeader>
                    <CardTitle>Последние проданные книги</CardTitle>
                    <CardDescription>Последние 5 книг</CardDescription>
                  </CardHeader>
                  <CardContent className="">
                    <RecentSales />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="books" className="space-y-4">
              <BooksTable books={books} />
            </TabsContent>
            <TabsContent value="reviews" className="space-y-4">
              <ReviewsTable reviews={reviews} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
