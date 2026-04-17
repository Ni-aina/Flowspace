"use client";

import Link from "next/link";
import { AuthButton } from "./auth-button";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

interface NavbarProps {
  isAuthenticated?: boolean;
}

export const Navbar = ({ isAuthenticated = false }: NavbarProps) => {
  const router = useRouter();

  const navigateToSignIn = () => {
    router.push("/auth/sign-in");
  }
  
  const navigateToSignUp = () => {
    router.push("/auth/sign-up");
  }
  
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">FS</span>
            </div>
            <span className="font-bold text-xl hover:scale-105 transition-transform">Flowspace</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="#features" 
              className="text-sm font-medium hover:scale-105 transition-transform"
            >
              Features
            </Link>
            <Link 
              href="#about" 
              className="text-sm font-medium hover:scale-105 transition-transform"
            >
              About
            </Link>
            <Link 
              href="#contact"
              className="text-sm font-medium hover:scale-105 transition-transform"
            >
              Contact
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {
            isAuthenticated ? 
            <Button variant="outline" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
           : 
            <>
              <AuthButton
                title="Sign In"
                variant="outline"
                onClick={navigateToSignIn}
              />
              <AuthButton
                title="Sign Up"
                className="bg-primary text-primary-foreground hover:bg-primary/95 hover:text-primary-foreground"
                onClick={navigateToSignUp}
              />
            </>
          }
        </div>
      </div>
    </nav>
  )
}
