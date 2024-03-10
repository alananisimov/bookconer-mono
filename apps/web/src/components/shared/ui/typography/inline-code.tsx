import { type ReactNode } from "react";
import { cn } from "~/lib/utils";

export function TypographyInlineCode({
  children,
  ...props
}: {
  children: ReactNode;
} & React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <code
      className={cn(
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
        props.className,
      )}
      {...props}
    >
      {children}
    </code>
  );
}
