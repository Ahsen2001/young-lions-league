import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

const widths = { sm: "max-w-2xl", md: "max-w-5xl", lg: "max-w-7xl", full: "max-w-none" } as const;

type PageContainerProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
  size?: keyof typeof widths;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function PageContainer<T extends ElementType = "div">({
  as,
  children,
  className = "",
  size = "lg",
  ...props
}: PageContainerProps<T>) {
  const Component = as ?? "div";
  return (
    <Component className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${widths[size]} ${className}`} {...props}>
      {children}
    </Component>
  );
}
