
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        winter: "bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-300",
        spring: "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300",
        summer: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-300",
        fall: "bg-orange-100 text-orange-800 dark:bg-orange-800/30 dark:text-orange-300",
        ongoing: "bg-purple-100 text-purple-800 dark:bg-purple-800/30 dark:text-purple-300",
        completed: "bg-teal-100 text-teal-800 dark:bg-teal-800/30 dark:text-teal-300",
      },
      size: {
        default: "h-5 text-xs",
        sm: "h-4 text-[10px]",
        lg: "h-6 text-sm",
      },
    },
    defaultVariants: {
      variant: "completed",
      size: "default",
    },
  }
);

export interface SeasonBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  season?: string;
  year?: number;
  status?: string;
}

const determineSeason = (month: number): string => {
  if (month >= 12 || month <= 2) return "winter";
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  return "fall";
};

export function SeasonBadge({
  className,
  variant,
  size,
  season,
  year,
  status,
  ...props
}: SeasonBadgeProps) {
  // Determine the current season if not provided
  const currentSeason = season || determineSeason(new Date().getMonth() + 1);
  const currentYear = year || new Date().getFullYear();
  const badgeStatus = status || "completed";

  // Use the season as the variant if it's one of our predefined variants
  const badgeVariant = (currentSeason.toLowerCase() as "winter" | "spring" | "summer" | "fall") || variant || "completed";

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(badgeVariants({ variant: badgeVariant, size }), className)}
      {...props}
    >
      {status ? (
        status
      ) : (
        <>
          {currentSeason.charAt(0).toUpperCase() + currentSeason.slice(1)} {currentYear}
        </>
      )}
    </motion.div>
  );
}

export default SeasonBadge;
