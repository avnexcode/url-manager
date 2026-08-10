import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { Container } from "./container";

type SectionContainerProps = {
  padded?: boolean;
  containerClassName?: string;
  container?: boolean;
};

export const SectionContainer = forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & SectionContainerProps
>(
  (
    {
      children,
      className,
      padded = false,
      container = false,
      containerClassName,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={cn("relative h-full w-full", containerClassName)}>
        {container ? (
          <Container
            ref={ref}
            className={cn(className, padded ? "px-4" : "")}
            {...props}
          >
            {children}
          </Container>
        ) : (
          <main
            ref={ref}
            className={cn(className, padded ? "px-4" : "")}
            {...props}
          >
            {children}
          </main>
        )}
      </div>
    );
  },
);

SectionContainer.displayName = "SectionContainer";

