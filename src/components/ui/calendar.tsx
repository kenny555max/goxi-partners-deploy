import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";

interface CalendarProps {
    mode?: "single" | "range" | "multiple";
    selected?: Date | Date[] | undefined;
    onSelect?: (date: Date | undefined) => void;
    initialFocus?: boolean;
    className?: string;
}

export const Calendar: React.FC<CalendarProps> = ({
                                                      mode = "single",
                                                      selected,
                                                      onSelect,
                                                      initialFocus = false,
                                                      className,
                                                  }) => {
    const [currentMonth, setCurrentMonth] = React.useState(new Date());

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const handlePrevMonth = () => {
        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
    };

    const handleSelectDate = (day: number) => {
        if (onSelect) {
            const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            onSelect(selectedDate);
        }
    };

    const isSelected = (day: number) => {
        if (!selected) return false;

        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);

        if (Array.isArray(selected)) {
            return selected.some(s => s.toDateString() === date.toDateString());
        }

        return selected.toDateString() === date.toDateString();
    };

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days = [];
    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    return (
        <div className={`p-3 ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <Button
                    onClick={handlePrevMonth}
                    variant="outline"
                    className="h-7 w-7 p-0"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="font-semibold">
                    {monthNames[month]} {year}
                </div>
                <Button
                    onClick={handleNextMonth}
                    variant="outline"
                    className="h-7 w-7 p-0"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map(day => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => (
                    <div key={index} className="aspect-square">
                        {day ? (
                            <button
                                onClick={() => handleSelectDate(day)}
                                className={`w-full h-full flex items-center justify-center rounded-full text-sm ${
                                    isSelected(day)
                                        ? "bg-custom-green text-white"
                                        : "hover:bg-gray-100"
                                }`}
                            >
                                {day}
                            </button>
                        ) : (
                            <span></span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
