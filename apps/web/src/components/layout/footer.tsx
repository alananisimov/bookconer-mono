import Link from "next/link";
import { type HTMLAttributes } from "react";
import { Button } from "~/components/shared/ui/shadcn/button";
import { Telegram } from "~/components/shared/icons";
export default function Footer({ ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="" {...props}>
      <p className="">
        Проект от{" "}
        <Link
          className="font-semibold underline-offset-4 transition-colors hover:underline"
          href="https://t.me/hollz69"
          target="_blank"
          rel="noopener noreferrer"
        >
          gothex
        </Link>
      </p>
      <Button className="mt-2" variant={"outline"}>
        <Telegram className="mr-2 h-4 w-4" /> Связаться в Telegram
      </Button>
    </div>
  );
}
