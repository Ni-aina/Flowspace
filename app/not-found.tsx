"use client";

import { Button } from "@/components/ui/button";
import { Search, Home, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full space-y-8 text-center">
            <div className="flex justify-center">
            <div className="relative">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                <Search className="w-10 h-10 text-muted-foreground" />
                </div>
                <div className="absolute -inset-1 bg-muted/20 rounded-full animate-pulse opacity-75"></div>
            </div>
            </div>

            <div className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground">
                Page not found
            </h1>
            
            <p className="text-lg text-muted-foreground">
                Sorry, we couldn't find the page you're looking for.
            </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button 
                onClick={() => router.back()}
                className="flex items-center gap-2 cursor-pointer hover:opacity-90"
                variant="outline"
            >
                <ArrowLeft className="w-4 h-4" />
                Go Back
            </Button>
            
            <Button 
                onClick={() => router.replace("/")}
                className="flex items-center gap-2 cursor-pointer hover:opacity-90"
                variant="default"
            >
                <Home className="w-4 h-4" />
                Go Home
            </Button>
            </div>

            <div className="pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
                If you believe this is an error, please contact our support team.
            </p>
            </div>
        </div>
    </div>
  )
}
