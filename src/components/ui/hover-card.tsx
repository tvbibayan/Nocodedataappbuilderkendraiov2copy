"use client";

import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";

import { cn, popoverSurfaceClass } from "./utils";
type HoverCardProps = React.ComponentPropsWithoutRef<
  typeof HoverCardPrimitive.Root
>;

function HoverCard({
  openDelay = 150,
  closeDelay = 100,
  ...props
}: HoverCardProps) {
  return (
    <HoverCardPrimitive.Root
      data-slot="hover-card"
      openDelay={openDelay}
      closeDelay={closeDelay}
      {...props}
    />
  );
}

const HoverCardTrigger = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Trigger>
>(({ ...props }, ref) => {
  return (
    <HoverCardPrimitive.Trigger
      ref={ref}
      data-slot="hover-card-trigger"
      {...props}
    />
  );
});
HoverCardTrigger.displayName = HoverCardPrimitive.Trigger.displayName;

type HoverCardContentProps = React.ComponentPropsWithoutRef<
  typeof HoverCardPrimitive.Content
> & {
  container?: HTMLElement | null;
  showArrow?: boolean;
  arrowClassName?: string;
};

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  HoverCardContentProps
>(
  (
    {
      className,
      align = "center",
      sideOffset = 4,
      container,
      showArrow = false,
      arrowClassName,
      children,
      ...contentProps
    }: HoverCardContentProps,
    ref: React.ForwardedRef<
      React.ElementRef<typeof HoverCardPrimitive.Content>
    >,
  ) => {
    return (
      <HoverCardPrimitive.Portal
        container={container}
        data-slot="hover-card-portal"
      >
        <HoverCardPrimitive.Content
          ref={ref}
          data-slot="hover-card-content"
          align={align}
          sideOffset={sideOffset}
          className={cn(popoverSurfaceClass, "w-64 p-4", className)}
          {...contentProps}
        >
          {children}
          {showArrow ? (
            <HoverCardPrimitive.Arrow
              data-slot="hover-card-arrow"
              className={cn(
                "fill-popover stroke-border",
                arrowClassName,
              )}
            />
          ) : null}
        </HoverCardPrimitive.Content>
      </HoverCardPrimitive.Portal>
    );
  },
);
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

export { HoverCard, HoverCardTrigger, HoverCardContent };
