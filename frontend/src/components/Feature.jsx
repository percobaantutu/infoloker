import React from "react";
import { jobSeekerFeatures, employerFeatures } from "../utils/data";
import { useTranslation } from "react-i18next";

const Feature = () => {
  const { t } = useTranslation();

  return (
    <section className="feature-section py-20 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {/* Using the single key ensures grammar is correct across languages, 
                rather than splitting "Everything You Need to" and "Succeed" manually */}
            <span className="bg-gradient-to-r from-blue-600 to-gray-900 bg-clip-text text-transparent">
              {t('landing.features.title')}
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('landing.features.subtitle')}
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-16 lg:gap-24">
          {/* Job Seeker Section */}
          <div>
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                {t('landing.features.forJobSeekers')}
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
            </div>
            <div className="space-y-8">
              {jobSeekerFeatures.map((feature, index) => (
                <div key={index} className="group flex items-start space-x-4 p-6 rounded-2xl hover:bg-blue-50 transition-all duration-300 cursor-pointer">
                  {/* Icon Wrapper */}
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>

                  {/* Text Content */}
                  <div>
                    {/* Wrapped in t() so it looks for these strings in your translation.json */}
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">{t(feature.title)}</h4>
                    <p className="text-gray-600 leading-relaxed">{t(feature.description)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Employer Section */}
          <div>
            <div>
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  {t('landing.features.forEmployers')}
                </h3>
                <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-gray-900 mx-auto rounded-full"></div>
              </div>
            </div>
            <div className="space-y-8">
              {employerFeatures.map((feature, index) => (
                <div key={index} className="group flex items-start space-x-4 p-6 rounded-2xl hover:bg-purple-50 transition-colors duration-300">
                  {/* Icon Wrapper */}
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <feature.icon className="w-6 h-6 text-gray-900" />
                  </div>

                  {/* Text Content */}
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">{t(feature.title)}</h4>
                    <p className="text-gray-600 leading-relaxed">{t(feature.description)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feature;