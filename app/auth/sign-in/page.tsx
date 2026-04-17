"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials")
      }

      localStorage.setItem("user", JSON.stringify(data.user))
      
      window.location.href = "/dashboard"
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : "An error occurred" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Welcome Back</h1>
        <p className="text-muted-foreground mt-2">
          Sign in to your Flowspace account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
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
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            aria-invalid={!!errors.email}
          />
          {
            errors.email && 
            <p className="text-sm text-destructive">{errors.email}</p>
          }
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
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              aria-invalid={!!errors.password}
            />
            {
              showPassword ?
              <Eye
                size={18}
                className="text-muted-foreground cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              />
              :
              <EyeOff
                size={18}
                className="text-muted-foreground cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              />
            }
          </div>
          {
            errors.password && 
            <p className="text-sm text-destructive">{errors.password}</p>
          }
        </div>

        {
          errors.general && 
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {errors.general}
          </div>
        }

        <Button
          type="submit"
          className="w-full h-10"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">
          Don't have an account?{" "}
        </span>
        <Link
          href="/auth/sign-up"
          className="text-primary hover:underline font-medium"
        >
          Sign Up
        </Link>
      </div>
    </div>
  )
}