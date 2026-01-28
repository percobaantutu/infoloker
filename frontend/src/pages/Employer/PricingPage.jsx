import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Check, Loader, Star, Shield, Zap } from "lucide-react";
import { useSubscription } from "../../hooks/useSubscription";
import { formatRupiah } from "../../utils/formatRupiah";

const PricingCard = ({ title, price, features, recommended, onSubscribe, isLoading, icon: Icon }) => (
  <div className={`relative p-8 rounded-2xl border transition-all duration-300 ${recommended ? "border-blue-600 shadow-xl scale-105 bg-white z-10" : "border-gray-200 bg-white hover:border-blue-200 hover:shadow-lg"}`}>
    
    {recommended && (
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold tracking-wide">
        RECOMMENDED
      </div>
    )}

    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${recommended ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"}`}>
        <Icon className="w-6 h-6" />
    </div>

    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
    <div className="mt-4 flex items-baseline text-gray-900">
      <span className="text-4xl font-bold tracking-tight">Rp {formatRupiah(String(price))}</span>
      <span className="ml-1 text-xl text-gray-500">/mo</span>
    </div>
    <p className="mt-2 text-sm text-gray-500">Perfect for growing companies.</p>

    <ul className="mt-8 space-y-4">
      {features.map((feature) => (
        <li key={feature} className="flex items-start">
          <Check className="h-5 w-5 text-green-500 shrink-0" />
          <span className="ml-3 text-sm text-gray-700">{feature}</span>
        </li>
      ))}
    </ul>

    <button
      onClick={onSubscribe}
      disabled={isLoading}
      className={`mt-8 w-full py-3 px-4 rounded-xl font-bold text-sm transition-colors ${
        recommended
          ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200"
          : "bg-blue-50 text-blue-700 hover:bg-blue-100"
      }`}
    >
      {isLoading ? <Loader className="w-5 h-5 animate-spin mx-auto" /> : "Choose Plan"}
    </button>
  </div>
);

const PricingPage = () => {
  const { subscribe, isLoading } = useSubscription();

  const handleSubscribe = (planType) => {
    subscribe(planType);
  };

  return (
    <DashboardLayout activeMenu="pricing">
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl font-display">
              Simple, transparent pricing
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Choose the plan that fits your hiring needs. Cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
            
            {/* Basic */}
            <PricingCard
              title="Basic"
              price={99000}
              icon={Shield}
              features={[
                "Post up to 3 jobs",
                "Basic Analytics",
                "Email Support",
                "30 Days Job Visibility"
              ]}
              onSubscribe={() => handleSubscribe("basic")}
              isLoading={isLoading}
            />

            {/* Premium */}
            <PricingCard
              title="Premium"
              price={299000}
              icon={Star}
              recommended={true}
              features={[
                "Unlimited Job Posts",
                "Featured Job Listings",
                "Advanced Analytics",
                "Verified Company Badge",
                "Priority Support"
              ]}
              onSubscribe={() => handleSubscribe("premium")}
              isLoading={isLoading}
            />

            {/* Enterprise */}
            <PricingCard
              title="Enterprise"
              price={999000}
              icon={Zap}
              features={[
                "Everything in Premium",
                "Dedicated Account Manager",
                "API Access",
                "Custom Branding",
                "SLA Guarantee"
              ]}
              onSubscribe={() => handleSubscribe("enterprise")}
              isLoading={isLoading}
            />

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PricingPage;