"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

interface InfoPopoverProps {
  triggerLabel?: string;
  content: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  className?: string;
}

/**
 * InfoPopover component for displaying instructions or disclaimers
 * @component
 * @example
 * ```tsx
 * <InfoPopover
 *   triggerLabel="More Info"
 *   content="This section contains important information about..."
 *   side="right"
 * />
 * ```
 */
export function InfoPopover({
  triggerLabel = "Info",
  content,
  side = "right",
  align = "start",
  className,
}: InfoPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-6 w-6 p-0 text-muted-foreground hover:text-foreground",
            className
          )}
          aria-label={triggerLabel}
        >
          <Info className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side={side} align={align} className="text-sm">
        <div className="space-y-2">
          <h4 className="font-medium leading-none">{triggerLabel}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {content}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export { Popover, PopoverTrigger, PopoverContent };