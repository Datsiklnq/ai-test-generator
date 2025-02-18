import { cn } from "../../../src/app/lib/utils";

export function Button({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      className={cn("px-8 py-2 bg-blue-500 text-white rounded", className)}
      {...props}
    />
  );
}
