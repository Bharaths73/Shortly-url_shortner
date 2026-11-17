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
import {
  BarChart3,
  ChartNoAxesCombined,
  CircleAlert,
  Link2,
  MousePointer2,
  Plus,
  TrendingUp,
} from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

function ChartSkeletonCard({ title, description }) {
  return (
    <Card className="chart-card" aria-busy="true" aria-label={`Loading ${title} chart`}>
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
    { title: "Total links", key: "totalUrls", icon: Link2, tone: "purple" },
    { title: "Created today", key: "urlsToday", icon: Plus, tone: "green" },
    { title: "Created this month", key: "urlsThisMonth", icon: TrendingUp, tone: "blue" },
    { title: "Total clicks", key: "totalClicks", icon: MousePointer2, tone: "purple" },
    { title: "Clicks today", key: "clicksToday", icon: ChartNoAxesCombined, tone: "green" },
    { title: "Clicks this month", key: "clicksThisMonth", icon: BarChart3, tone: "blue" },
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
      <div className="grid min-h-[50vh] place-items-center">
        <div className="flex max-w-sm flex-col items-center text-center">
          <span className="mb-4 grid size-12 place-items-center rounded-2xl bg-destructive/10 text-destructive">
            <CircleAlert className="size-5" />
          </span>
          <h1 className="text-lg font-semibold tracking-tight">We couldn’t load your overview</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Your dashboard is temporarily unavailable. Please try again in a little while.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <div>
          <span className="page-eyebrow">OVERVIEW</span>
          <h1 className="page-title">Your activity</h1>
          <p className="page-description">
            A quick look at how your links are performing.
          </p>
        </div>
        {!isPending && (
          <Button
            render={<Link to="/home" />}
            className="hidden gap-2 rounded-xl px-4 sm:inline-flex"
          >
            <Plus className="size-4" />
            Create a link
          </Button>
        )}
      </header>
      {isPending ? (
        <>
          <SkeletonDetailFlex
            size={6}
            className="grid min-h-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
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
                className="metric-card flex flex-row items-center justify-between gap-4 transition-[transform,box-shadow] duration-200 ease-out motion-reduce:transition-none"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <span className={`metric-card__icon ${config.tone === "green" ? "metric-card__icon--green" : config.tone === "blue" ? "metric-card__icon--blue" : ""}`}>
                    <config.icon className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <CardHeader className="p-0">
                      <CardTitle className="metric-card__value">
                        {dashboardDetails?.[config.key] ?? 0}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <p className="metric-card__label">
                        {config.title}
                      </p>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <Card className="chart-card">
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
                      radius={[7, 7, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="chart-card">
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
                      radius={[7, 7, 0, 0]}
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
