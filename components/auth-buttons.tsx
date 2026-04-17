"use client";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface AuthButtonProps {
  onClick?: () => void;
  title: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export const AuthButton = ({ 
  onClick, 
  title,
  variant = "ghost", 
  size = "default",
  className
}: AuthButtonProps) => {
  return (
    <Button 
      variant={variant} 
      size={size}
      onClick={onClick}
      className={
        cn(`font-medium cursor-pointer hover:scale-105 transition-transform ${className}`)
      }
    >
      {title}
    </Button>
  )
}