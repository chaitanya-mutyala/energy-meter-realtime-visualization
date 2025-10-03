import React from "react";

export default function Button({
    children,
    type = "button",
    // Keep the hex code as the default for the prop
    bgColor = "#4259f4", 
    textColor = "text-white",
    className = "",
    ...props
}) {
    return (
        <button
            // 1. Remove bgColor from the className string
            className={`px-4 py-2 rounded-lg ${textColor} ${className}`}
            
            // 2. Apply the color directly using the style prop
            style={{ backgroundColor: bgColor }}
            
            {...props}
        >
            {children}
        </button>
    );
}