"use client"

import * as React from "react"
import {
    Toast,
    ToastClose,
    ToastDescription,
    ToastTitle,
} from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export function ToastProvider() {
    const { toasts } = useToast()

    return (
        <div className="fixed top-0 z-[100] flex flex-col items-end gap-2 p-4 md:bottom-0 md:right-0 md:top-auto">
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
                )
            })}
        </div>
    )
}