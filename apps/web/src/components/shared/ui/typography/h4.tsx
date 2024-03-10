import { type ReactNode } from "react";
import { cn } from "~/lib/utils";

export function TypographyH4({
  children,
  ...props
}: {
  children: ReactNode;
} & React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h4
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight",
        props.className,
      )}
      {...props}
    >
      {children}
    </h4>
  );
}
