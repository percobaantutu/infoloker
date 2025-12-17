import { TrendingUp } from "lucide-react";
import Card from "../Card";

const StatCard = ({ title, value, icon: Icon, color, trend, bg }) => (
  <Card className={`${bg || "bg-white"}`}>
    <div className="flex items-center justify-between mb-4 ">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-8 h-8 text-white" />
      </div>

      {trend && (
        <div className="flex items-center space-x-1">
          <TrendingUp />
          <span className={`text-sm font-medium px-2 py-1 rounded-full ${trend >= 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
            {trend > 0 ? "+" : ""}
            {trend}%
          </span>
        </div>
      )}
    </div>
    <h3 className=" text-sm font-medium text-white">{title}</h3>
    <p className="text-2xl font-bold  mt-1 text-white">{value}</p>
  </Card>
);

export default StatCard;
