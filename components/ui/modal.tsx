"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  showCloseButton?: boolean
  closeOnBackdropClick?: boolean
  closeOnEscape?: boolean
  size?: "sm" | "md" | "lg" | "xl" | "full"
  className?: string
}

const ModalUI = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      description,
      children,
      showCloseButton = true,
      closeOnBackdropClick = true,
      closeOnEscape = true,
      size = "md",
      className,
      ...props
    },
    ref
  ) => {
    const modalRef = React.useRef<HTMLDivElement>(null)
    const [isAnimating, setIsAnimating] = React.useState(false)

    React.useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape" && closeOnEscape && isOpen) {
          handleClose()
        }
      }

      if (isOpen) {
        document.addEventListener("keydown", handleEscape)
        document.body.style.overflow = "hidden"
        
        setTimeout(() => setIsAnimating(true), 10)
      } else {
        document.body.style.overflow = "unset"
        setIsAnimating(false)
      }

      return () => {
        document.removeEventListener("keydown", handleEscape)
        document.body.style.overflow = "unset"
      }
    }, [isOpen, closeOnEscape])

    const handleClose = () => {
      setIsAnimating(false)
      setTimeout(() => onClose(), 150)
    }

    const handleBackdropClick = (event: React.MouseEvent) => {
      if (event.target === event.currentTarget && closeOnBackdropClick) {
        handleClose()
      }
    }

    if (!isOpen) return null

    const sizeClasses = {
      sm: "max-w-md",
      md: "max-w-lg",
      lg: "max-w-2xl",
      xl: "max-w-4xl",
      full: "max-w-[95vw] mx-4"
    }

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClick={handleBackdropClick}
      >
        <div
          className={cn(
            "absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
            isAnimating ? "opacity-100" : "opacity-0"
          )}
        />
        
        <div
          ref={ref || modalRef}
          className={cn(
            "relative z-10 w-full rounded-lg border bg-background p-6 shadow-lg transition-all duration-300",
            sizeClasses[size],
            isAnimating 
              ? "scale-100 opacity-100 translate-y-0" 
              : "scale-95 opacity-0 translate-y-4",
            className
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
          aria-describedby={description ? "modal-description" : undefined}
          {...props}
        >
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                {title && (
                  <h2 
                    id="modal-title"
                    className="text-lg font-semibold leading-none tracking-tight"
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p 
                    id="modal-description"
                    className="text-sm text-muted-foreground mt-1"
                  >
                    {description}
                  </p>
                )}
              </div>
              {showCloseButton && (
                <button
                  onClick={handleClose}
                  className="rounded-sm opacity-70 ring-offset-background transition-opacity 
                  cursor-pointer hover:opacity-100 
                  focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 
                  disabled:pointer-events-none"
                  aria-label="Close modal"
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          )}

          <div className="relative">
            {children}
          </div>
        </div>
      </div>
    )
  }
)

ModalUI.displayName = "Modal"

export { ModalUI }
