import React from 'react';
import { Code, Stethoscope, Megaphone, LineChart, PenTool, Database, Truck, Headphones, Briefcase, Users, Layers, Monitor, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { CATEGORIES } from '../utils/data';

const CategoryGrid = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const getCategoryIcon = (categoryValue) => {
        switch (categoryValue) {
            case "Engineering": return Code;
            case "Healthcare": return Stethoscope;
            case "Marketing": return Megaphone;
            case "Finance": return LineChart;
            case "Design": return PenTool;
            case "Data Science": return Database;
            case "Logistics": return Truck;
            case "Customer-service": return Headphones;
            case "Sales": return Briefcase;
            case "IT & Software": return Monitor;
            case "Product": return Layers;
            case "HR": return Users;
            case "Operations": return ShoppingCart;
            default: return Briefcase;
        }
    };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('landing.categories.title', 'Explore by Category')}</h2>
          <p className="text-gray-600">{t('landing.categories.subtitle', 'Find the right job in your area of expertise.')}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {CATEGORIES.slice(0, 7).map((cat, index) => { 
            const Icon = getCategoryIcon(cat.value);
            return (
                <div 
                    key={index}
                    onClick={() => navigate(`/find-jobs?category=${cat.value}`)}
                    className="group p-6 border border-gray-100 rounded-xl hover:shadow-md hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-300 cursor-pointer flex flex-col items-center text-center"
                >
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                        <Icon className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{cat.label}</h3>
                   
                </div>
            );
          })}
          <div 
                    key="9"
                    onClick={() => navigate ("/find-jobs")}
                    className="group p-6 border border-gray-100 rounded-xl hover:shadow-md hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-300 cursor-pointer flex flex-col items-center text-center"
                >
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                       🔍
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">Explore more job</h3>
                    
                </div>
      </div>
        </div>
         
    </section>
  );
};

export default CategoryGrid;
