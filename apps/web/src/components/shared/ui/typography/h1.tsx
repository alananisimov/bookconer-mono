import { type ReactNode } from "react";
import { cn } from "~/lib/utils";

export function TypographyH1({
  children,
  ...props
}: {
  children: ReactNode;
} & React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        `scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl`,
        props.className,
      )}
      {...props}
    >
      {children}
    </h1>
  );
}
