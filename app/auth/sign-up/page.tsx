"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import InputPassword from "@/components/ui/input-password"
import { ChangeEvent, useActionState, useState } from "react"
import { signup } from "@/actions/auth.action"

export default function SignUp() {
    const [state, action, pending] = useActionState(signup, undefined);
    const [formState, setFormState] = useState({
        name: "",
        email: ""
    })

    const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <div className="w-full max-w-md mx-auto p-6">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold">Create Account</h1>
                <p className="text-muted-foreground mt-2">
                    Join Flowspace to start collaborating
                </p>
            </div>

            <form action={action} className="space-y-4 md:space-y-6">
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
                        value={formState.name}
                        onChange={handleFormChange}
                    />
                    {state?.errors?.name && <p className="text-sm text-destructive">{state.errors.name}</p>}
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
                        value={formState.email}
                        onChange={handleFormChange}
                    />
                    {state?.errors?.email && <p className="text-sm text-destructive">{state.errors.email}</p>}
                </div>

                <InputPassword
                    label="Password"
                    error={state?.errors?.password?.at(0)}
                />

                <InputPassword
                    label="Confirm Password"
                    error={state?.errors?.confirmPassword?.at(0)}
                />

                <Button
                    type="submit"
                    className="w-full h-10 cursor-pointer hover:bg-primary/95"
                    disabled={pending}
                >
                    {
                        pending ?
                            "Signing up..." :
                            "Sign Up"
                    }
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