"use client";

import toCamelCase from "@/utils/toCamelCase";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface InputPasswordProps {
    label: string;
    defaultValue?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
}

const InputPassword = ({
    label,
    defaultValue,
    onChange,
    error
}: InputPasswordProps) => {
    const [showPassword, setShowPassword] = useState(false)
    const handleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    return (
        <div className="flex flex-col space-y-1">
          <label htmlFor="password" className="text-sm font-medium">
            {label}
          </label>
          <div className="flex items-center border rounded-lg gap-2 px-2">
            <input
              id={label.toLowerCase()}
              name={toCamelCase(label)}
              type={showPassword ? "text" : "password"}
              className="w-full h-10 outline-none text-sm"
              placeholder="Enter your password"
              defaultValue={defaultValue}
              onChange={onChange}
              disabled={false}
              aria-invalid={!!error}
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
          {
            error && 
            <p className="text-sm text-destructive">{error}</p>
          }
        </div>
    )
}
 
export default InputPassword;