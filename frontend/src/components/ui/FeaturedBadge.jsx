import { Sparkles } from "lucide-react";

/**
 * FeaturedBadge Component
 * Displays a "Featured" badge on featured job listings
 */
const FeaturedBadge = ({ size = "sm" }) => {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1
        ${sizeClasses[size]}
        bg-gradient-to-r from-amber-400 to-orange-500
        text-white font-semibold
        rounded-full
        shadow-sm
      `}
    >
      <Sparkles size={iconSizes[size]} className="animate-pulse" />
      Featured
    </span>
  );
};

export default FeaturedBadge;
