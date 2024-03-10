import { type ReactNode } from "react";
import { cn } from "~/lib/utils";

export function TypographyP({
  children,
  ...props
}: {
  children: ReactNode;
} & React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <p
      className={cn("leading-7 [&:not(:first-child)]:mt-6", props.className)}
      {...props}
    >
      {children}
    </p>
  );
}
