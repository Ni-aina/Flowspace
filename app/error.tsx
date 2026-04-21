"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Error({
  reset
}: {
  reset: () => void
}) {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full space-y-8 text-center">
            <div className="flex justify-center">
            <div className="relative">
                <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-destructive" />
                </div>
                <div className="absolute -inset-1 bg-destructive/20 rounded-full animate-ping opacity-75"></div>
            </div>
            </div>

            <div className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground">
                Something went wrong
            </h1>
            
            <p className="text-lg text-muted-foreground">
                We apologize for the inconvenience. An unexpected error has occurred.
            </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button 
                onClick={reset}
                className="flex items-center gap-2 cursor-pointer hover:opacity-90"
                variant="default"
            >
                <RefreshCw className="w-4 h-4" />
                Try Again
            </Button>
            
            <Button 
                onClick={() => router.replace("/")}
                className="flex items-center gap-2 cursor-pointer hover:opacity-90"
                variant="outline"
            >
                <Home className="w-4 h-4" />
                Go Home
            </Button>
            </div>

            <div className="pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
                If this problem persists, please contact our support team.
            </p>
            </div>
        </div>
    </div>
  )
}