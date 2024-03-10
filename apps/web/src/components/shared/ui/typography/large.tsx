import { type ReactNode } from "react";
import { cn } from "~/lib/utils";

export function TypographyLarge({
  children,
  ...props
}: {
  children: ReactNode;
} & React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <div className={cn("text-lg font-semibold", props.className)} {...props}>
      {children}
    </div>
  );
}
