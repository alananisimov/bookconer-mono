import { type ReactNode } from "react";
import { cn } from "~/lib/utils";

export function TypographyH3({
  children,
  ...props
}: {
  children: ReactNode;
} & React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight",
        props.className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
}
