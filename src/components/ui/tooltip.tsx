import { cn } from "../../../src/app/lib/utils";

export function Tooltip({
  children,
  text,
  className,
}: {
  children: React.ReactNode;
  text: string;
  className?: string;
}) {
  return (
    <div className="relative group">
      {children}
      <div
        className={cn(
          "absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-[-4px] transition-all duration-200 ease-in-out",
          "bg-gray-800 text-white text-sm font-medium py-1.5 px-3 rounded-lg shadow-lg",
          "whitespace-nowrap pointer-events-none",
          className
        )}
      >
        {text}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></span>
      </div>
    </div>
  );
}
