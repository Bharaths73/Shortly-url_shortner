import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function SkeletonDetailCard() {
  return (
    <Card className="w-full cursor-pointer p-6 max-h-max flex flex-row items-center gap-4 justify-start mb-5">
      <Skeleton className="h-24 w-24 rounded-md bg-gray-200" />
      <div className="display flex flex-col flex-1 gap-y-3">
        <Skeleton className="w-[90%] h-7 rounded-full bg-gray-200" />
        <Skeleton className="w-[60%] h-7 rounded-full bg-gray-200" />
      </div>
    </Card>
  );
}

export default SkeletonDetailCard;
