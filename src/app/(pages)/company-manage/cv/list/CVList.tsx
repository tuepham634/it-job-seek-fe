/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { positionList, workingFormList } from "@/config/variable";
import { FiFileText } from "react-icons/fi";
import { motion } from "framer-motion";
import { useState } from "react";
import { CVItem } from "./CVItem";
import useSWR from "swr";
import { fetcherWithCredentials } from "@/utils/fetcher";

export const CVList = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/company/cv/list?page=${page}`,
    fetcherWithCredentials
  );

  const loading = isLoading;
  const listCV = data?.code === "success" ? data.listCV : [];
  const totalPage = data?.code === "success" ? data.totalPage : 0;
  const totalRecord = data?.code === "success" ? data.totalRecord : 0;

  const handlePagination = (event: any) => {
    const value = event.target.value;
    setPage(parseInt(value));
  };

  const handleDeleteSuccess = () => {
    mutate(); // Revalidate SWR
  };

  return (
    <div className="container mx-auto px-[16px]">
      {/* Tổng số CV */}
      {totalRecord !== undefined && totalRecord > 0 && (
        <h2 className="font-[700] text-[28px] text-[#121212] mb-[30px]">
          Có tổng cộng {totalRecord} CV được gửi đến
        </h2>
      )}

      {/* Loading */}
      {loading ? (
        <p className="text-center text-gray-500 mt-10 animate-pulse">
          Đang tải CV...
        </p>
      ) : listCV.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center mt-24"
        >
          <div className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl shadow-sm p-10 flex flex-col items-center max-w-[400px] text-center">
            <div className="relative">
              <FiFileText className="text-gray-400 text-[80px] mb-4" />
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-400 rounded-full animate-ping"></span>
            </div>
            <h3 className="text-gray-700 text-[22px] font-semibold mb-2">
              Hiện chưa có CV nào được gửi
            </h3>
            <p className="text-gray-500 text-[15px] leading-[1.6]">
              Khi ứng viên nộp CV, danh sách sẽ hiển thị tại đây để bạn dễ dàng
              xem và quản lý.
            </p>
          </div>
        </motion.div>
      ) : (
        <>
          {/* Danh sách CV */}
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[20px]">
            {listCV.map((item: any) => {
              item.jobPosition = positionList.find(
                (pos) => pos.value === item.jobPosition
              )?.label;
              item.jobWorkingForm = workingFormList.find(
                (work) => work.value === item.jobWorkingForm
              )?.label;

              return (
                <CVItem
                  key={item.id}
                  item={item}
                  onDeleteSuccess={handleDeleteSuccess}
                />
              );
            })}
          </div>

          {/* Phân trang */}
          {!loading && totalPage && totalPage > 1 && (
            <div className="mt-[40px] flex justify-start">
              <select
                className="border border-[#DEDEDE] rounded-[8px] py-[12px] px-[18px] font-[400] text-[16px] text-[#414042] shadow-sm hover:border-[#bdbdbd] transition-all"
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
