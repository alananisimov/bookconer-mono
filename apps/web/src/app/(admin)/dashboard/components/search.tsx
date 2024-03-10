import { Input } from "~/components/shared/ui/shadcn/input";

export function Search() {
  return (
    <div>
      <Input
        type="search"
        placeholder="Search..."
        className="sm:ml-2 md:w-[200px] lg:w-[400px]"
      />
    </div>
  );
}
