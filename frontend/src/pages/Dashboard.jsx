import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getDashboardPage } from "@/Api/dashboardApi";
import { queryDefaults } from "@/tanstackQueries/queryDefaults";
import SkeletonDetailFlex from "@/components/common/SkeletonDetailFlex";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartAreaIcon, ChartBar, ChartBarBigIcon, TrendingUp } from "lucide-react";
import { useSelector } from "react-redux";

function ChartSkeletonCard({ title, description }) {
  return (
    <Card aria-busy="true" aria-label={`Loading ${title} chart`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="flex h-[280px] items-end justify-center gap-8 border-b pl-8">
          <Skeleton className="h-[30%] w-10 rounded-b-none" />
          <Skeleton className="h-[65%] w-10 rounded-b-none" />
          <Skeleton className="h-[45%] w-10 rounded-b-none" />
        </div>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const { user } = useSelector((state) => state.user);
  const {
    data: dashboardDetails,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["dashboard",user?.id],
    queryFn: () => getDashboardPage(),
    ...queryDefaults,
    enabled: !!user?.id,
    refetchOnWindowFocus: true,
  });

  const analyticsConfig = [
    { title: "Total URLs", key: "totalUrls" },
    { title: "URLs Today", key: "urlsToday" },
    { title: "URLs This Month", key: "urlsThisMonth" },
    { title: "Total Clicks", key: "totalClicks" },
    { title: "Clicks Today", key: "clicksToday" },
    { title: "Clicks This Month", key: "clicksThisMonth" },
  ];

  const urlChartData = [
    { period: "Today", urls: Number(dashboardDetails?.urlsToday ?? 0) },
    { period: "This month", urls: Number(dashboardDetails?.urlsThisMonth ?? 0) },
    { period: "All time", urls: Number(dashboardDetails?.totalUrls ?? 0) },
  ];
  const clickChartData = [
    { period: "Today", clicks: Number(dashboardDetails?.clicksToday ?? 0) },
    {
      period: "This month",
      clicks: Number(dashboardDetails?.clicksThisMonth ?? 0),
    },
    { period: "All time", clicks: Number(dashboardDetails?.totalClicks ?? 0) },
  ];
  const urlChartConfig = {
    urls: { label: "URLs", color: "var(--chart-1)" },
  };
  const clickChartConfig = {
    clicks: { label: "Clicks", color: "var(--chart-2)" },
  };

  if (isError) {
    return (
      <div className="text-2xl text-gray-600 mx-auto my-auto w-full flex justify-center">
        Something Went Wrong
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {isPending ? (
        <>
          <SkeletonDetailFlex
            size={6}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
          />
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <ChartSkeletonCard
              title="URL activity"
              description="Created today, this month, and all time"
            />
            <ChartSkeletonCard
              title="Click activity"
              description="Clicks today, this month, and all time"
            />
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {analyticsConfig.map((config) => (
              <Card
                key={config.key}
                className="flex flex-row items-center justify-between gap-4 p-6 transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <div className="flex items-center gap-7">
                  <TrendingUp className="size-8"/>
                  <div className="flex flex-col gap-y-1.5">
                    <CardHeader className="p-0">
                      <CardTitle className="text-3xl">
                        {dashboardDetails?.[config.key] ?? 0}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <p className="text-sm text-muted-foreground">
                        {config.title}
                      </p>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <Card className="transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0">
              <CardHeader>
                <CardTitle>URL activity</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Created today, this month, and all time
                </p>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={urlChartConfig}
                  className="h-[280px]"
                >
                  <BarChart
                    accessibilityLayer
                    data={urlChartData}
                    margin={{ left: 8, right: 8 }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="period"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      allowDecimals={false}
                    />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="urls"
                      fill="var(--color-urls)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0">
              <CardHeader>
                <CardTitle>Click activity</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Clicks today, this month, and all time
                </p>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={clickChartConfig}
                  className="h-[280px]"
                >
                  <BarChart
                    accessibilityLayer
                    data={clickChartData}
                    margin={{ left: 8, right: 8 }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="period"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      allowDecimals={false}
                    />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="clicks"
                      fill="var(--color-clicks)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
