import { Crown, Sparkles } from "lucide-react";

/**
 * Premium Badge Component
 * Displays a badge indicating the employer's premium status
 * 
 * @param {Object} props
 * @param {string} props.plan - The plan type: 'basic', 'premium', or 'enterprise'
 * @param {string} props.size - Size variant: 'sm', 'md', or 'lg'
 * @param {boolean} props.showLabel - Whether to show the plan name label
 */
const PremiumBadge = ({ plan, size = "sm", showLabel = true }) => {
  // Don't render for free plan
  if (!plan || plan === "free") return null;

  // Plan configurations
  const planConfig = {
    basic: {
      label: "Basic",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      borderColor: "border-blue-200",
      iconColor: "text-blue-500",
      icon: Crown
    },
    premium: {
      label: "Premium",
      bgColor: "bg-gradient-to-r from-amber-50 to-yellow-50",
      textColor: "text-amber-700",
      borderColor: "border-amber-200",
      iconColor: "text-amber-500",
      icon: Crown
    },
    enterprise: {
      label: "Enterprise",
      bgColor: "bg-gradient-to-r from-purple-50 to-indigo-50",
      textColor: "text-purple-700",
      borderColor: "border-purple-200",
      iconColor: "text-purple-500",
      icon: Sparkles
    }
  };

  const config = planConfig[plan] || planConfig.basic;
  const IconComponent = config.icon;

  // Size configurations
  const sizeConfig = {
    sm: {
      padding: "px-1.5 py-0.5",
      iconSize: "w-3 h-3",
      textSize: "text-[10px]",
      gap: "gap-0.5"
    },
    md: {
      padding: "px-2 py-1",
      iconSize: "w-3.5 h-3.5",
      textSize: "text-xs",
      gap: "gap-1"
    },
    lg: {
      padding: "px-3 py-1.5",
      iconSize: "w-4 h-4",
      textSize: "text-sm",
      gap: "gap-1.5"
    }
  };

  const sizeStyles = sizeConfig[size] || sizeConfig.sm;

  return (
    <span
      className={`
        inline-flex items-center ${sizeStyles.gap} ${sizeStyles.padding}
        ${config.bgColor} ${config.textColor}
        border ${config.borderColor}
        rounded-full font-semibold ${sizeStyles.textSize}
        whitespace-nowrap
      `}
      title={`${config.label} Plan`}
    >
      <IconComponent className={`${sizeStyles.iconSize} ${config.iconColor}`} />
      {showLabel && <span>{config.label}</span>}
    </span>
  );
};

export default PremiumBadge;
