import { Link2 } from "lucide-react";

function BrandMark({ className = "" }) {
  return (
    <span className={`brand-lockup ${className}`}>
      <span className="brand-symbol" aria-hidden="true">
        <Link2 className="size-5" strokeWidth={2.2} />
      </span>
      <span className="brand-name">Shortly</span>
    </span>
  );
}

export default BrandMark;
