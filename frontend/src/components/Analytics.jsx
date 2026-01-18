import { motion } from "framer-motion";
import { TrendingUp, Users, Briefcase, Target } from "lucide-react";
import { useTranslation } from "react-i18next";

const Analytics = () => {
  const { t } = useTranslation();

  const stats = [
    {
      icon: Users,
      title: t('landing.analytics.activeUsers'), // "Active Users"
      value: "2.4M+",
      growth: "+15%",
      color: "blue",
    },
    {
      icon: Briefcase,
      title: t('landing.analytics.jobsPosted'), // "Jobs Posted"
      value: "150K+",
      growth: "+22%",
      color: "purple",
    },
    {
      icon: Target,
      title: t('landing.analytics.successfulHires'), // "Successful Hires"
      value: "89K+",
      growth: "+18%",
      color: "green",
    },
    {
      icon: TrendingUp,
      title: t('landing.analytics.matchRate'), // "Match Rate"
      value: "94%",
      growth: "+8%",
      color: "orange",
    },
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }} 
          viewport={{ once: true }} 
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('landing.analytics.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('landing.analytics.subtitle')}
          </p>
        </motion.div>
        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              {/* Top section: Icon and Growth */}
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <span className="text-green-500 text-sm font-semibold bg-green-50 px-2 py-1 rounded-full">
                  {stat.growth}
                </span>
              </div>

              {/* Bottom section: Value and Title */}
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
              <p className="text-gray-600">{stat.title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Analytics;