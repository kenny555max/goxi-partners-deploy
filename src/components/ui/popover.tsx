import * as React from "react";

interface PopoverContextValue {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    triggerRef: React.RefObject<HTMLButtonElement | null>;
    contentRef: React.RefObject<HTMLDivElement | null>;
}

const PopoverContext = React.createContext<PopoverContextValue | undefined>(undefined);

export const Popover: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [open, setOpen] = React.useState(false);
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);

    const handleClickOutside = React.useCallback((event: MouseEvent) => {
        if (
            contentRef.current &&
            !contentRef.current.contains(event.target as Node) &&
            triggerRef.current &&
            !triggerRef.current.contains(event.target as Node)
        ) {
            setOpen(false);
        }
    }, []);

    React.useEffect(() => {
        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open, handleClickOutside]);

    return (
        <PopoverContext.Provider value={{ open, setOpen, triggerRef, contentRef }}>
            {children}
        </PopoverContext.Provider>
    );
};

interface PopoverTriggerProps {
    asChild?: boolean;
    children: React.ReactNode;
}

export const PopoverTrigger: React.FC<PopoverTriggerProps> = ({
                                                                  asChild = false,
                                                                  children
                                                              }) => {
    const context = React.useContext(PopoverContext);

    if (!context) {
        throw new Error('PopoverTrigger must be used within a Popover');
    }

    const { open, setOpen, triggerRef } = context;

    const handleClick = () => {
        setOpen(!open);
    };

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children as React.ReactElement, {
            // eslint-disable-next-line
            // @ts-ignore
            ref: triggerRef,
            onClick: handleClick,
            "aria-expanded": open,
            "aria-haspopup": true
        });
    }

    return (
        <button
            ref={triggerRef}
            onClick={handleClick}
            aria-expanded={open}
            aria-haspopup={true}
        >
            {children}
        </button>
    );
};

interface PopoverContentProps {
    children: React.ReactNode;
    className?: string;
}

export const PopoverContent: React.FC<PopoverContentProps> = ({
                                                                  children,
                                                                  className
                                                              }) => {
    const context = React.useContext(PopoverContext);

    if (!context) {
        throw new Error('PopoverContent must be used within a Popover');
    }

    const { open, contentRef } = context;

    if (!open) return null;

    return (
        <div
            ref={contentRef}
            className={`absolute z-50 mt-2 rounded-md border bg-white shadow-md animate-in fade-in-0 zoom-in-95 ${className || ""}`}
            role="dialog"
        >
            {children}
        </div>
    );
};
