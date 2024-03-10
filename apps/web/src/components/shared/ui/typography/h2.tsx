import { type ReactNode } from "react";
import { cn } from "~/lib/utils";

export function TypographyH2({
  children,
  ...props
}: {
  children: ReactNode;
} & React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
        props.className,
      )}
      {...props}
    >
      {children}
    </h2>
  );
}
