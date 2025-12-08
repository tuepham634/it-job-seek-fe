  /* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { CardCompanyItem } from "@/app/components/card/CardCompanyItem";
import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";

export const CompanyList = () => {
  const [page, setPage] = useState(1);
  
  const { data, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/company/list?limitItems=6&page=${page}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000 // Cache for 1 minute
    }
  );

  const loading = isLoading;
  const companyList = data?.code === "success" ? data.companyList : [];
  const totalPage = data?.code === "success" ? data.totalPage : 0;

  // useEffect(() => {
  //   setLoading(true);
  //   fetch(
  //     `${process.env.NEXT_PUBLIC_API_URL}/company/list?limitItems=6&page=${page}`
  //   )
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (data.code === "success") {
  //         setCompanyList(data.companyList);
  //         setTotalPage(data.totalPage);
  //       } else {
  //         setCompanyList([]);
  //       }
  //     })
  //     .finally(() => setLoading(false));
  // }, [page]);

  const handlePagination = (event: any) => {
    setPage(parseInt(event.target.value));
  };

  // Skeleton card
  const CompanySkeleton = () => (
    <div className="border border-[#DEDEDE] rounded-[8px] p-[16px] bg-gradient-to-b from-gray-100 to-white animate-pulse">
      <div className="w-[80%] h-[20px] bg-gray-300 rounded mx-auto mb-[10px]" />
      <div className="w-[60%] h-[14px] bg-gray-200 rounded mx-auto mb-[6px]" />
      <div className="w-[70%] h-[16px] bg-gray-300 rounded mx-auto mb-[8px]" />
      <div className="flex justify-center gap-[8px] mt-[10px]">
        <div className="w-[60px] h-[30px] bg-gray-300 rounded" />
        <div className="w-[60px] h-[30px] bg-gray-300 rounded" />
      </div>
    </div>
  );

  return (
    <>
      <div className="grid lg:grid-cols-3 grid-cols-2 sm:gap-[20px] gap-x-[10px] gap-y-[20px]">
        {/* Skeleton khi đang load */}
        {loading &&
          Array.from({ length: 3 }).map((_, i) => <CompanySkeleton key={i} />)}

        {/* Nếu load xong mà không có dữ liệu */}
        {!loading && companyList.length === 0 && (
          <div className="col-span-full text-center text-gray-500 text-[16px]">
            Không có dữ liệu
          </div>
        )}

        {/* Dữ liệu thật */}
        {!loading &&
          companyList.map((item) => (
            <CardCompanyItem key={item.id} item={item} />
          ))}
      </div>

      {/* Phân trang */}
      {!loading && totalPage > 1 && (
        <div className="mt-[30px] text-center">
          <select
            className="border border-[#DEDEDE] rounded-[8px] py-[12px] px-[18px] font-[400] text-[16px] text-[#414042]"
            onChange={handlePagination}
            value={page}
          >
            {Array.from({ length: totalPage }).map((_, index) => (
              <option key={index} value={index + 1}>
                Trang {index + 1}
              </option>
            ))}
          </select>
        </div>
      )}
    </>
  );
};
