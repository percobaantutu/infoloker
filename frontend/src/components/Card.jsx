const Card = ({ title, subtitle, headerAction, className = "", children }) => {
  return (
    <div className={`bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}>
      {/* Header */}
      {(title || subtitle || headerAction) && (
        <div className="px-6 py-4 border-b border-gray-100 flex items-start justify-between gap-4">
          <div>
            {title && <h3 className="text-base font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
          </div>

          {headerAction && <div>{headerAction}</div>}
        </div>
      )}

      {/* Content */}
      <div className="p-6">{children}</div>
    </div>
  );
};

export default Card;
