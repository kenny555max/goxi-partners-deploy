import * as React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, ...props }, ref) => {
        return (
            <input
                type="checkbox"
                className={cn(
                    "h-4 w-4 rounded border-slate-300 text-custom-green focus:ring-custom-green",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };