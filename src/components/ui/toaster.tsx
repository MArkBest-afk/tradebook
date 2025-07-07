"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  // Toasts with `position: 'top-right'` go to the top right.
  const topRightToasts = toasts.filter(toast => toast.position === 'top-right');
  
  // All other toasts go to the bottom right (the default position).
  const bottomRightToasts = toasts.filter(toast => toast.position !== 'top-right');

  return (
    <>
      {/* Top Right Toaster */}
      <ToastProvider>
        {topRightToasts.map(function ({ id, title, description, action, icon, ...props }) {
          return (
            <Toast key={id} {...props}>
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
              {action}
              {icon}
              <ToastClose />
            </Toast>
          )
        })}
        {/* Viewport for top-right toasts. Stacks from the top down. */}
        <ToastViewport className="fixed top-0 right-0 flex-col p-4" />
      </ToastProvider>

      {/* Bottom Right Toaster (default) */}
      <ToastProvider>
        {bottomRightToasts.map(function ({ id, title, description, action, icon, ...props }) {
          return (
            <Toast key={id} {...props}>
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
              {action}
              {icon}
              <ToastClose />
            </Toast>
          )
        })}
        {/* Default viewport, positions at bottom-right */}
        <ToastViewport />
      </ToastProvider>
    </>
  )
}
