import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/shared/ui/shadcn/avatar";

export function RecentSales() {
  return (
    <div className=" space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-center">
        <div className="flex flex-row truncate">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>OM</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">Olivia Martin</p>
            <p className="text-sm text-muted-foreground">
              olivia.martin@email.com
            </p>
          </div>
        </div>
        <div className="mt-2 font-medium sm:ml-auto sm:mt-0">+$1,999.00</div>
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-center">
        <div className="flex flex-row truncate">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>OM</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">Olivia Martin</p>
            <p className="text-sm text-muted-foreground">
              olivia.martin@email.com
            </p>
          </div>
        </div>
        <div className="mt-2 font-medium sm:ml-auto sm:mt-0">+$1,999.00</div>
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-center">
        <div className="flex flex-row truncate">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>OM</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">Olivia Martin</p>
            <p className="text-sm text-muted-foreground">
              olivia.martin@email.com
            </p>
          </div>
        </div>
        <div className="mt-2 font-medium sm:ml-auto sm:mt-0">+$1,999.00</div>
      </div>
    </div>
  );
}
