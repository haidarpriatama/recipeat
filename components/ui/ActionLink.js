const baseClasses =
  "inline-flex items-center justify-center font-bold transition-all duration-300 ease-out active:scale-95";

const sizeClasses = {
  sm: "px-6 py-2.5 text-sm",
  md: "px-8 py-4 text-lg",
  lg: "px-10 py-4 text-xl",
};

const variantClasses = {
  primary:
    "rounded-xl bg-[#006941] text-white shadow-xl shadow-[#006941]/20 hover:scale-105",
  secondary: "rounded-xl bg-[#e0e3e4] text-[#2c2f30] hover:bg-[#dadddf]",
  accent:
    "rounded-full bg-[#006941] text-white hover:bg-[#004b2d] hover:scale-105 focus-visible:outline-none",
  header:
    "rounded-full bg-[#006941] text-white shadow-lg shadow-[#006941]/20 hover:scale-105",
};

export default function ActionLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
}) {
  const resolvedSize = sizeClasses[size] ?? sizeClasses.md;
  const resolvedVariant = variantClasses[variant] ?? variantClasses.primary;

  return (
    <a
      className={`${baseClasses} ${resolvedSize} ${resolvedVariant} ${className}`.trim()}
      href={href}
    >
      {children}
    </a>
  );
}