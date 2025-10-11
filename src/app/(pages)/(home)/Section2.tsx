/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { CardCompanyItem } from "@/app/components/card/CardCompanyItem";
import { CardCompanySkeleton } from "@/app/components/card/CardCompanySkeleton";
import { useEffect, useState } from "react";

export const Section2 = () => {
  const [companyList, setCompanyList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/list?limitItems=6`)
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "success") {
          setCompanyList(data.companyList);
        }
      })
      .catch((err) => console.error("Fetch company error:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-[60px]">
      <div className="container mx-auto px-[16px]">
        <h2 className="font-[700] sm:text-[28px] text-[24px] text-[#121212] text-center mb-[30px]">
          Nhà tuyển dụng hàng đầu
        </h2>

        <div className="grid lg:grid-cols-3 grid-cols-2 sm:gap-[20px] gap-x-[10px] gap-y-[20px]">
          {loading
            ? Array(6)
                .fill(0)
                .map((_, i) => <CardCompanySkeleton key={i} />)
            : companyList.map((item) => (
                <CardCompanyItem key={item.id} item={item} />
              ))}
        </div>
      </div>
    </div>
  );
};
