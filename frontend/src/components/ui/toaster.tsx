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

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} className="bg-green-600 text-white border-green-700 shadow-2xl">
            <div className="grid gap-1">
              {title && <ToastTitle className="text-white font-semibold">{title}</ToastTitle>}
              {description && (
                <ToastDescription className="text-green-100">{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="text-green-100 hover:text-white" />
          </Toast>
        )
      })}
      <ToastViewport className="top-20 right-4" />
    </ToastProvider>
  )
}