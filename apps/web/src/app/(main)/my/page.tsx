import Order from "~/components/user-panel/order/order";
import { TypographyH1 } from "~/components/shared/ui/typography/h1";
import { api } from "~/trpc/server";

export default async function MyCabinet() {
  const orders = await api.order.getList.query();
  return (
    <main className=" mx-auto flex max-w-screen-xl flex-col gap-y-6 px-3 pt-32 sm:px-8 xl:px-0">
      <TypographyH1>Личный кабинет</TypographyH1>
      <div className="flex ">
        {orders.map((order, index) => (
          <Order order={order} key={order.id} index={index + 1} />
        ))}
      </div>
    </main>
  );
}