import SkeletonDetailCard from "./SkeletonDetailCard";


function SkeletonDetailFlex({size=8, flow="COL", ...props}) {
  return (
    <div className={`w-full min-h-screen flex ${flow==="ROW" ? "flex-row" : "flex-col"} gap-4`} {...props}>
      {Array.from({ length: size}).map((_, index) => (
        <SkeletonDetailCard key={index} />
      ))}
    </div>
  );
}

export default SkeletonDetailFlex;