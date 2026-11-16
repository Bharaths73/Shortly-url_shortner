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

function SkeletonCard() {
  return (
    <Card className="w-full max-w-sm cursor-pointer p-3 max-h-max">
      <Skeleton className="w-full h-48 bg-gray-200" />
      <Skeleton className="w-[90%] h-7 rounded-full bg-gray-200" />
      <Skeleton className="w-[60%] h-7 rounded-full bg-gray-200" />
    </Card>
  );
}

export default SkeletonCard;
