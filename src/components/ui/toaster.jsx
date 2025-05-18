
import React from "react";
import { useToast } from "../../hooks/use-toast.jsx";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastTitle,
} from "./toast.jsx";


export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-0 right-0 z-50 flex flex-col gap-2 max-w-md p-4">
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
    </div>
  );
}
