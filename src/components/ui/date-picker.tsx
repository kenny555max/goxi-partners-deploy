import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Input } from "./input";

interface DatePickerProps {
    value?: Date;
    onChange?: (date: Date | undefined) => void;
    placeholder?: string;
    className?: string;
}

export function DatePicker({
   value,
   onChange,
   placeholder = "Pick a date",
   className,
}: DatePickerProps) {
    console.log(placeholder)
    const [date, setDate] = React.useState<Date | undefined>(value);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value ? new Date(e.target.value) : undefined;
        setDate(newDate);
        onChange?.(newDate);
    };

    return (
        <div className="relative">
            <Input
                type="date"
                value={date ? format(date, "yyyy-MM-dd") : ""}
                onChange={handleChange}
                className={cn("pl-10", className)}
            />
            <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        </div>
    );
}