// import React from "react";

// export function Button({
//   variant = "primary",
//   size = "md",
//   icon: Icon,
//   children,
//   className = "",
//   ...props
// }) {
//   const baseClasses =
//     "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

//   const variantClasses = {
//     primary:
//       "bg-hospital-purple text-white hover:bg-hospital-purple-dark focus:ring-hospital-purple",
//     secondary:
//       "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400",
//     success:
//       "bg-success-500 text-white hover:bg-success-600 focus:ring-success-500",
//     danger: "bg-error-500 text-white hover:bg-error-600 focus:ring-error-500",
//     outline:
//       "border-2 border-hospital-purple text-hospital-purple hover:bg-hospital-purple/10 focus:ring-hospital-purple",
//   };

//   const sizeClasses = {
//     sm: "px-3 py-1.5 text-sm",
//     md: "px-4 py-2 text-base",
//     lg: "px-6 py-3 text-lg",
//   };

//   return (
//     <button
//       className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
//       {...props}
//     >
//       {Icon && <Icon className="w-4 h-4" />}
//       {children}
//     </button>
//   );
// }



import React from "react";

export function Button({
  variant = "primary",
  size = "md",
  icon: Icon,
  children,
  className = "",
  ...props
}) {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

  const variantClasses = {
    primary:
      "bg-hospital-purple text-white hover:bg-hospital-purple-dark focus:ring-hospital-purple",
    secondary:
      "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400",
    success:
      "bg-success-500 text-white hover:bg-success-600 focus:ring-success-500",
    danger: "bg-error-500 text-white hover:bg-error-600 focus:ring-error-500",
    outline:
      "border-2 border-hospital-purple text-hospital-purple hover:bg-hospital-purple/10 focus:ring-hospital-purple",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs sm:text-sm md:text-base",
    md: "px-4 py-2 text-sm sm:text-base md:text-lg",
    lg: "px-5 py-3 text-base sm:text-lg md:text-xl",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
      <span className="whitespace-nowrap">{children}</span>
    </button>
  );
}
