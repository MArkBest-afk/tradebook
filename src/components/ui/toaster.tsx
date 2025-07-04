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

  const topRightToasts = toasts.filter(toast => toast.position === 'top-right');
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
        <ToastViewport className="flex-col top-0 right-0 sm:flex-col sm:top-4 sm:right-4 sm:bottom-auto" />
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
        <ToastViewport />
      </ToastProvider>
    </>
  )
}
