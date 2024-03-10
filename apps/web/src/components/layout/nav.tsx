import { authOptions } from "@acme/api";
import Navbar from "./nav-bar";
import { getServerSession } from "next-auth/next";
import { api } from "~/trpc/server";

export default async function Nav() {
  const session = await getServerSession(authOptions);
  const books = await api.book.getList.query();
  return <Navbar session={session} books={books} />;
}
