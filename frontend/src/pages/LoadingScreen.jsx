import { LoaderCircle } from "lucide-react";
import BrandMark from "@/components/common/BrandMark";

function LoadingScreen() {
  return (
    <main className="verify-page" aria-live="polite" aria-busy="true">
      <div className="flex flex-col items-center gap-6">
        <BrandMark />
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <LoaderCircle className="size-4 animate-spin text-primary" />
          Preparing your workspace…
        </div>
      </div>
    </main>
  );
}

export default LoadingScreen;