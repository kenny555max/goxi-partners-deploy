import React from "react";

export default function MaxWidthWrapper({ children, className }: { className?: string; children?: React.ReactNode }) {
    return(
        <div className={`${className} lg:max-w-[1200px] sm:w-[80%] w-[90%] mx-auto`}>
            {children}
        </div>
    );
}