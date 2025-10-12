import { Suspense } from "react";
import AllPageContent from "./AllPageContent";

export const dynamic = "force-dynamic";

export default function AllPage() {
  return (
    <Suspense fallback={<div className="text-center py-10 text-gray-600">Đang tải dữ liệu...</div>}>
      <AllPageContent />
    </Suspense>
  );
}
