"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"

export default function SignUp() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const handleShowPassword = () => {
        setShowPassword(!showPassword)
    }
    const handleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }

    return (
        <div className="w-full max-w-md mx-auto p-6">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Create Account</h1>
            <p className="text-muted-foreground mt-2">
            Join Flowspace to start collaborating
            </p>
        </div>

        <form className="space-y-4 md:space-y-6">
            <div className="flex flex-col space-y-1">
            <label htmlFor="name" className="text-sm font-medium">
                Name
            </label>
            <Input
                id="name"
                name="name"
                type="text"
                className="h-10"
                placeholder="Enter your name"
            />
            </div>

            <div className="flex flex-col space-y-1">
            <label htmlFor="email" className="text-sm font-medium">
                Email
            </label>
            <Input
                id="email"
                name="email"
                type="email"
                className="h-10"
                placeholder="Enter your email"
            />
            </div>

            <div className="flex flex-col space-y-1">
            <label htmlFor="password" className="text-sm font-medium">
                Password
            </label>
            <div className="flex items-center border rounded-lg gap-2 px-2">
                <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                className="w-full h-10 outline-none text-sm"
                placeholder="Enter your password"
                />
                {
                    showPassword ? 
                        <Eye
                            size={18}
                            className="text-muted-foreground cursor-pointer"
                            onClick={handleShowPassword}
                        />
                    : 
                        <EyeOff
                            size={18}
                            className="text-muted-foreground cursor-pointer"
                            onClick={handleShowPassword}
                        />
                    
                }
            </div>
            </div>

            <div className="flex flex-col space-y-1">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
            </label>
            <div className="flex items-center border rounded-lg gap-2 px-2">
                <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full h-10 outline-none text-sm"
                    placeholder="Confirm your password"
                />
                {
                    showConfirmPassword ? 
                        <Eye
                            size={18}
                            className="text-muted-foreground cursor-pointer"
                            onClick={handleShowConfirmPassword}
                        />
                    : 
                        <EyeOff
                            size={18}
                            className="text-muted-foreground cursor-pointer"
                            onClick={handleShowConfirmPassword}
                        />
                    
                }
            </div>
            </div>

            <Button
            type="submit"
            className="w-full h-10"
            >
            Sign Up
            </Button>
        </form>

        <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
            Already have an account?{" "}
            </span>
            <Link
            href="/auth/sign-in"
            className="text-primary hover:underline font-medium"
            >
            Sign In
            </Link>
        </div>
        </div>
    )
}