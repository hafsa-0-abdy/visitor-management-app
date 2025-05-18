import React from "react";
import { cn } from "../../lib/utils.js";
import { X } from "lucide-react";

const ToastContext = React.createContext({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
});

const Toast = React.forwardRef(
  ({ className, title, description, action, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "fixed top-0 right-0 mt-4 mr-4 max-w-md rounded-md border bg-white p-4 shadow-lg",
        className
      )}
      {...props}
    >
      <div className="flex justify-between items-start gap-2">
        <div className="grid gap-1">{children}</div>
        {action}
        {props.onClose && <ToastClose onClick={props.onClose} />}
      </div>
    </div>
  )
);
Toast.displayName = "Toast";

// Reusable Title component
const ToastTitle = ({ children }) => (
  <div className="text-sm font-semibold">{children}</div>
);

// Reusable Description component
const ToastDescription = ({ children }) => (
  <div className="text-sm opacity-90">{children}</div>
);

// Reusable Close button component
const ToastClose = ({ onClick }) => (
  <button
    className="ml-4 opacity-50 hover:opacity-100 transition-opacity"
    onClick={onClick}
  >
    <X className="h-4 w-4" />
  </button>
);

// React-based toaster provider
const Toaster = ({ children }) => {
  const [toasts, setToasts] = React.useState([]);

  const addToast = (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    return id;
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (toasts.length > 0) {
        removeToast(toasts[0].id);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [toasts]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed z-50 top-0 right-0 flex flex-col gap-2 max-w-md p-4">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            title={toast.title}
            description={toast.description}
            onClose={() => removeToast(toast.id)}
            className={`animate-in fade-in slide-in-from-right-full duration-300 ${
              toast.variant === "destructive" ? "border-red-500 bg-red-100" : ""
            }`}
          >
            <ToastTitle>{toast.title}</ToastTitle>
            <ToastDescription>{toast.description}</ToastDescription>
          </Toast>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// DOM-based fallback toast function
const toast = ({ title, description, variant }) => {
  const toastElement = document.createElement("div");
  toastElement.className = `fixed z-50 top-4 right-4 max-w-md rounded-md border bg-white p-4 shadow-lg animate-in fade-in slide-in-from-right-full duration-300 ${
    variant === "destructive" ? "border-red-500 bg-red-100" : ""
  }`;

  const content = document.createElement("div");
  content.className = "grid gap-1";

  if (title) {
    const titleElement = document.createElement("div");
    titleElement.className = "text-sm font-semibold";
    titleElement.textContent = title;
    content.appendChild(titleElement);
  }

  if (description) {
    const descriptionElement = document.createElement("div");
    descriptionElement.className = "text-sm opacity-90";
    descriptionElement.textContent = description;
    content.appendChild(descriptionElement);
  }

  toastElement.appendChild(content);

  const closeButton = document.createElement("button");
  closeButton.className =
    "absolute top-2 right-2 opacity-50 hover:opacity-100 transition-opacity";
  closeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
  closeButton.onclick = () => {
    toastElement.remove();
  };
  toastElement.appendChild(closeButton);

  document.body.appendChild(toastElement);

  setTimeout(() => {
    toastElement.classList.add("animate-out", "fade-out", "slide-out-to-right-full");
    setTimeout(() => toastElement.remove(), 300);
  }, 5000);
};

export {
  Toast,
  Toaster,
  toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
};
