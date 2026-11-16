import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NavLink } from "react-router-dom";
import logo from "../assets/hero.png";
import { useQuery } from "@tanstack/react-query";
import { getDashboardPage } from "@/Api/dashboardApi";
import { queryDefaults } from "@/tanstackQueries/queryDefaults";
import SkeletonGrid from "@/components/common/SkeletonGrid";
import SkeletonDetailFlex from "@/components/common/SkeletonDetailFlex";

function Dashboard() {
  const {
    data: dashboardDetails,
    isPending,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => getDashboardPage(),
    ...queryDefaults,
  });

  const analyticsConfig = [
    { title: "Total URLs", key: "totalUrls" },
    { title: "URLs Today", key: "urlsToday" },
    { title: "URLs This Month", key: "urlsThisMonth" },
    { title: "Total Clicks", key: "totalClicks" },
    { title: "Clicks Today", key: "clicksToday" },
    { title: "Clicks This Month", key: "clicksThisMonth" },
  ];

  if (isError) {
    return (
      <p className="text-2xl text-gray-600 mx-auto my-auto">
        Something Went Wrong
      </p>
    );
  }

  return (
    <div>
      {isPending ? <SkeletonDetailFlex size={6} className="grid grid-cols-3 gap-7"/> :
      <div className=" grid grid-cols-3 gap-7">
        {analyticsConfig.map((config) => (
          <Card
            key={config.key}
            className="flex flex-row items-center gap-4 justify-between p-8"
          >
            <div className="flex flex-row items-center gap-4 justify-start gap-x-8">
              <img src={logo} className="w-10 h-10" />
              <div className="flex flex-col gap-y-1.5">
                <CardHeader className="p-0">
                  <CardTitle className="text-3xl">
                    {dashboardDetails?.[config.key] ?? 0}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex flex-col">
                  <p className="text-sm text-gray-500">{config.title}</p>
                </CardContent>
              </div>
            </div>
          </Card>
        ))}
      </div>
}
    </div>
  );
}

export default Dashboard;
