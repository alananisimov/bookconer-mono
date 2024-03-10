"use client";

import Image from "next/image";
import Link from "next/link";
import { type Session } from "next-auth";
import UserDropdown from "../user-dropdown";
import useScroll from "~/lib/hooks/use-scroll";
import { Button } from "~/components/shared/ui/shadcn/button";
import { SearchBar } from "../search-bar";
import { type Book } from "@acme/db";
import { ArrowLeft, ShoppingBasketIcon } from "lucide-react";
import { useCheckout } from "../checkout/checkout-modal";
import { usePathname } from "next/navigation";
import { useCart } from "../cart/cart";
import { useSignInModal } from "../utility/signin-modal";
import logo from "~/../public/book.webp";
export default function NavBar({
  session,
  books,
}: {
  session: Session | null;
  books: Book[];
}) {
  const { SignInModal, setShowSignInModal } = useSignInModal();
  const { CartModal, setShowCartModal } = useCart();
  const { CheckoutModal } = useCheckout();
  const pathname = usePathname();
  const scrolled = useScroll(25);
  return (
    <>
      <SignInModal />
      <CartModal />
      <CheckoutModal />
      <div
        className={`fixed top-0 flex w-full justify-center px-3 sm:px-8 ${
          scrolled
            ? "bg-[var(--backgroud)]/50 border-b backdrop-blur-xl"
            : "bg-[var(--backgroud)]/0"
        } z-30 transition-all`}
      >
        <div className=" inline-flex h-[3.5rem] w-full max-w-screen-xl items-center justify-between">
          <div className="hidden flex-1 sm:flex">
            <Link
              href="/"
              className="font-display flex items-center text-lg md:text-xl"
            >
              <Image
                src={logo}
                alt="Bookconer logo"
                width={32}
                height={32}
                className="mr-3 h-8 w-8 rounded-full"
              ></Image>
              <p className="hidden md:flex">Книжный уголок</p>
            </Link>
          </div>

          {pathname === "/" ? (
            <SearchBar className="  mr-3 md:ml-3 " books={books} />
          ) : (
            <Link href={"/"} className="mr-3 flex-1 sm:flex-none">
              <Button
                variant="outline"
                className={" w-full justify-between gap-x-1 truncate"}
              >
                На главную
                <ArrowLeft className="ml-2 h-4 w-4 shrink-0 " />
              </Button>
            </Link>
          )}
          <div className="ml-auto flex flex-row items-center space-x-3 ">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowCartModal(true)}
            >
              <ShoppingBasketIcon className="h-4 w-4" />
            </Button>

            {session ? (
              <UserDropdown session={session} />
            ) : (
              <Button
                className=" border  p-1.5 px-4 text-sm transition-all  "
                onClick={() => setShowSignInModal(true)}
              >
                Войти
              </Button>
            )}
          </div>
          <div></div>
        </div>
      </div>
    </>
  );
}
