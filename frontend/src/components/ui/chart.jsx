import { createContext, useContext, useId } from "react";
import { cn } from "@/lib/utils";
import { ResponsiveContainer } from "recharts";

const ChartContext = createContext(null);

function ChartContainer({ config, className, children, ...props }) {
  const chartId = useId().replace(/:/g, "");
  const chartStyles = Object.fromEntries(
    Object.entries(config).map(([key, item]) => [
      `--color-${key}`,
      item.color,
    ]),
  );

  return (
    <ChartContext.Provider value={config}>
      <div
        data-chart={chartId}
        className={cn("w-full text-xs", className)}
        style={chartStyles}
        {...props}
      >
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

function ChartTooltipContent({ active, payload, label }) {
  const config = useContext(ChartContext);

  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-popover-foreground shadow-md">
      <p className="mb-1 font-medium">{label}</p>
      {payload.map((item) => {
        const key = item.dataKey;
        const labelText = config?.[key]?.label ?? item.name;

        return (
          <div className="flex items-center gap-2" key={key}>
            <span
              className="size-2 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-muted-foreground">{labelText}</span>
            <span className="font-medium tabular-nums">
              {Number(item.value ?? 0).toLocaleString()}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export { ChartContainer, ChartTooltipContent };
