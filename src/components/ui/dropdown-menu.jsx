
import React from "react";
import { cn } from "../../lib/utils.js";

// Simple dropdown implementation for JavaScript version
const DropdownMenu = ({ children }) => {
  return <div className="relative inline-block text-left">{children}</div>;
};

const DropdownMenuTrigger = ({ children, asChild, ...props }) => {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (open && !event.target.closest('[data-dropdown-menu]')) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div data-dropdown-menu>
      <div onClick={() => setOpen(!open)} {...props}>
        {children}
      </div>
      {open && (
        <div className="z-50 absolute right-0 mt-2 min-w-[8rem] rounded-md border bg-white shadow-md overflow-hidden">
          <DropdownMenuContext.Provider value={{ open, setOpen }}>
            {React.Children.map(props.children, (child) => {
              if (child && child.type === DropdownMenuContent) {
                return child.props.children;
              }
              return null;
            })}
          </DropdownMenuContext.Provider>
        </div>
      )}
    </div>
  );
};

const DropdownMenuContent = ({ children, align = "center", sideOffset = 4, className, ...props }) => {
  return null; // Content is handled by the Trigger
};

const DropdownMenuContext = React.createContext({
  open: false,
  setOpen: () => {},
});

const useDropdownMenu = () => React.useContext(DropdownMenuContext);

const DropdownMenuItem = React.forwardRef(
  ({ className, children, asChild, ...props }, ref) => {
    const { setOpen } = useDropdownMenu();
    
    const handleClick = (e) => {
      if (props.onClick) {
        props.onClick(e);
      }
      setOpen(false);
    };

    if (asChild) {
      // Clone the child and add our props
      return React.cloneElement(React.Children.only(children), {
        className: cn(
          "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          className
        ),
        onClick: handleClick,
        ...props,
      });
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuSeparator = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("-mx-1 my-1 h-px bg-slate-200", className)}
      {...props}
    />
  )
);

DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
};
