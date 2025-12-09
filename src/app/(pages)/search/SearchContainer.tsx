/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { CardJobItem } from "@/app/components/card/CardJobItem";
import { CardJobSkeleton } from "@/app/components/card/CardJobSkeleton";
import { positionList, workingFormList } from "@/config/variable";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";

export const SearchContainer = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const language = searchParams.get("language") || "";
  const city = searchParams.get("city") || "";
  const company = searchParams.get("company") || "";
  const keyword = searchParams.get("keyword") || "";
  const position = searchParams.get("position") || "";
  const workingForm = searchParams.get("workingForm") || "";

  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [language, city, company, keyword, position, workingForm]);

  const { data, isLoading } = useSWR(
    `/search?language=${language}&city=${city}&company=${company}&keyword=${keyword}&position=${position}&workingForm=${workingForm}&page=${page}`,
    fetcher
  );

  const loading = isLoading;
  const jobList = data?.jobs || [];
  const totalPage = data?.totalPage;
  const totalRecord = data?.totalRecord;

  const handleFilterPosition = (event: any) => {
    const value = event.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("position", value);
    else params.delete("position");
    router.push(`?${params.toString()}`);
  };

  const handleFilterWorkingForm = (event: any) => {
    const value = event.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("workingForm", value);
    else params.delete("workingForm");
    router.push(`?${params.toString()}`);
  };

  const handlePagination = (event: any) => {
    const value = event.target.value;
    setPage(parseInt(value));
  };

  return (
    <div className="container mx-auto px-[16px]">
      {totalRecord !== undefined && (
        <h2 className="font-[700] text-[28px] text-[#121212] mb-[30px]">
          {totalRecord > 0
            ? `Tìm thấy ${totalRecord} việc làm phù hợp`
            : "Không tìm thấy việc làm nào phù hợp"}{" "}
          <span className="text-[#121212]">
            {keyword && `"${keyword}"`}
            {language && ` · ${language}`}
            {city && ` · ${city}`}
            {company && ` · ${company}`}
          </span>
        </h2>
      )}

      {/* Bộ lọc */}
      <div
        className="bg-white rounded-[8px] py-[10px] px-[20px] mb-[30px] flex flex-wrap gap-[12px]"
        style={{ boxShadow: "0px 4px 20px 0px #0000000F" }}
      >
        <select
          className="border border-[#DEDEDE] rounded-[20px] h-[36px] px-[18px] font-[400] text-[16px] text-[#414042]"
          onChange={handleFilterPosition}
          defaultValue={position}
        >
          <option value="">Vị trí</option>
          {positionList.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <select
          className="border border-[#DEDEDE] rounded-[20px] h-[36px] px-[18px] font-[400] text-[16px] text-[#414042]"
          onChange={handleFilterWorkingForm}
          defaultValue={workingForm}
        >
          <option value="">Hình thức làm việc</option>
          {workingFormList.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      {/* Danh sách job */}
      {loading ? (
        <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[20px]">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <CardJobSkeleton key={i} />
            ))}
        </div>
      ) : jobList.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center mt-20"
        >
          <div className="p-10 rounded-2xl bg-gray-100 flex flex-col items-center shadow-md">
            <FiSearch className="text-gray-400 text-[60px] mb-4" />
            <h3 className="text-gray-600 text-[20px] font-semibold mb-2 text-center">
              Không tìm thấy việc làm nào phù hợp
            </h3>
            <p className="text-gray-400 text-center max-w-[400px] leading-[1.6]">
              Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn bộ lọc khác để xem thêm
              các công việc hấp dẫn nhé 💼
            </p>
          </div>
        </motion.div>
      ) : (
        <>
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[20px]">
            {jobList.map((item: any) => (
              <CardJobItem key={item.id} item={item} />
            ))}
          </div>

          {/* Phân trang */}
          {totalPage && (
            <div className="mt-[30px] flex justify-start">
              <select
                className="border border-[#DEDEDE] rounded-[8px] py-[12px] px-[18px] font-[400] text-[16px] text-[#414042]"
                value={page}
                onChange={handlePagination}
              >
                {Array(totalPage)
                  .fill("")
                  .map((_, index) => (
                    <option key={index} value={index + 1}>
                      Trang {index + 1}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </>
      )}
    </div>
  );
};
