"use client"

import { useActionState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import InputPassword from "@/components/ui/inputPassword"
import { signin } from "@/actions/auth"

export default function SignIn() {
  const [state, formAction, pending] = useActionState(signin, undefined)
  
  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Welcome Back</h1>
        <p className="text-muted-foreground mt-2">
          Sign in to your Flowspace account
        </p>
      </div>

      <form action={formAction} className="space-y-4 md:space-y-6">
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
            disabled={pending}
            aria-invalid={!!state?.errors?.email}
          />
          {
            state?.errors?.email && 
            <p className="text-sm text-destructive">{state.errors.email.at(0)}</p>
          }
        </div>

        <InputPassword
          label="Password"
          error={state?.errors?.password?.at(0)}
        />

        {
          state?.message && 
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {state.message}
          </div>
        }

        <Button
          type="submit"
          className="mt-1 w-full h-10 cursor-pointer hover:bg-primary/95"
          disabled={pending}
        >
          {pending ? "Signing in..." : "Sign In"}
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