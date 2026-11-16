
import SkeletonCard from "./SkeletonCard";

function SkeletonGrid({size=12,layout="GRID", flow="COL", ...props}) {
  return (
    <div className={`w-full min-h-screen ${layout==="GRID" ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : `flex ${flow==="ROW"} ? "flex-row" : "flex-col"`} gap-4`} {...props}>
      {Array.from({ length: size}).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}

export default SkeletonGrid;