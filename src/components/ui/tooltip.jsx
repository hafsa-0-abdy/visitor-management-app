
import React from "react";
import { cn } from "../../lib/utils.js";

const TooltipContext = React.createContext({});

const TooltipProvider = ({ children }) => {
  return (
    <TooltipContext.Provider value={{}}>{children}</TooltipContext.Provider>
  );
};

const Tooltip = ({ children }) => {
  return <>{children}</>;
};

const TooltipTrigger = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TooltipTrigger.displayName = "TooltipTrigger";

const TooltipContent = React.forwardRef(
  ({ className, sideOffset = 4, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
        className
      )}
      {...props}
    />
  )
);
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
