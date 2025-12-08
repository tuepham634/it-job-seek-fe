/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { cvStatusList, positionList, workingFormList } from "@/config/variable";
import Link from "next/link";
import { useState } from "react";
import { FaBriefcase, FaCircleCheck, FaUserTie } from "react-icons/fa6";
import { CVDetailModal } from "./CVDetailModal";
import { ButtonDelete } from "@/app/components/button/ButtonDelete";
import { motion } from "framer-motion";
import { FileText, PlusCircle } from "lucide-react";
import useSWR from "swr";
import { fetcherWithCredentials } from "@/utils/fetcher";

export const CVList = () => {
  const [selectedCV, setSelectedCV] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/user/cv/list?page=${page}`,
    fetcherWithCredentials
  );

  const loading = isLoading;
  const listCV = data?.code === "success" ? data.listCV : [];
  const totalPage = data?.code === "success" ? data.totalPage : 0;

  const handlePagination = (event: any) => {
    const value = event.target.value;
    setPage(parseInt(value));
  };

  // Skeleton loading
  const CVSkeleton = () => (
    <div className="border border-[#DEDEDE] rounded-[8px] p-[16px] bg-gradient-to-b from-gray-100 to-white animate-pulse">
      <div className="w-[80%] h-[20px] bg-gray-300 rounded mx-auto mb-[10px]" />
      <div className="w-[60%] h-[14px] bg-gray-200 rounded mx-auto mb-[6px]" />
      <div className="w-[70%] h-[16px] bg-gray-300 rounded mx-auto mb-[8px]" />
      <div className="w-[60%] h-[14px] bg-gray-200 rounded mx-auto mb-[6px]" />
      <div className="w-[50%] h-[14px] bg-gray-200 rounded mx-auto mb-[6px]" />
      <div className="flex justify-center gap-[8px] mt-[10px]">
        <div className="w-[60px] h-[30px] bg-gray-300 rounded" />
        <div className="w-[60px] h-[30px] bg-gray-300 rounded" />
      </div>
    </div>
  );

  return (
    <>
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[20px]">
        {/* Skeleton loading */}
        {loading &&
          Array.from({ length: 3 }).map((_, idx) => <CVSkeleton key={idx} />)}

        {/* Khi không có CV nào */}
        {!loading && listCV.length === 0 && (
          <motion.div
            className="col-span-full flex flex-col items-center justify-center py-[100px] text-center bg-white rounded-[12px] shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FileText size={80} className="text-gray-400 mb-4" />
            <h3 className="text-[22px] font-semibold text-[#333] mb-2">
              Bạn chưa có CV nào
            </h3>
            <p className="text-[#777] text-[16px] mb-6 max-w-[400px]">
              Tạo ngay CV đầu tiên để gây ấn tượng với nhà tuyển dụng và mở ra nhiều cơ hội việc làm hơn.
            </p>
            <Link
              href="/company/list"
              className="inline-flex items-center gap-2 bg-[#2563EB] text-white px-5 py-3 rounded-[10px] hover:bg-[#1E40AF] transition-colors"
            >
              <PlusCircle size={20} />
              Tạo CV mới
            </Link>
          </motion.div>
        )}

        {/* Hiển thị danh sách CV */}
        {!loading &&
          listCV.map((item: any) => {
            const jobPositionLabel = positionList.find(
              (itemPos) => itemPos.value === item.jobPosition
            )?.label;

            const jobWorkingFormLabel = workingFormList.find(
              (itemWork) => itemWork.value === item.jobWorkingForm
            )?.label;

            const status = cvStatusList.find(
              (itemStatus) => itemStatus.value === item.status
            );

            return (
              <div
                key={item.id}
                className="border border-[#DEDEDE] rounded-[8px] flex flex-col relative truncate"
                style={{
                  background:
                    "linear-gradient(180deg, #F6F6F6 2.38%, #FFFFFF 70.43%)",
                }}
              >
                <img
                  src="/assets/images/card-bg.svg"
                  alt=""
                  className="absolute top-[0px] left-[0px] w-[100%] h-auto"
                />

                <h3 className="mt-[20px] mx-[16px] font-[700] text-[18px] text-[#121212] text-center flex-1 whitespace-normal line-clamp-2">
                  {item.jobTitle}
                </h3>

                <div className="mt-[12px] text-center font-[400] text-[14px] text-black">
                  Công ty:{" "}
                  <span className="font-[700]">{item.companyName}</span>
                </div>

                <div className="mt-[6px] text-center font-[600] text-[16px] text-[#121212]">
                  {item.jobSalaryMin.toLocaleString("vi-VN")}$ -{" "}
                  {item.jobSalaryMax.toLocaleString("vi-VN")}$ 
                </div>

                <div className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] text-[#121212]">
                  <FaUserTie className="text-[16px]" /> {jobPositionLabel}
                </div>

                <div className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] text-[#121212]">
                  <FaBriefcase className="text-[16px]" /> {jobWorkingFormLabel}
                </div>

                <div
                  className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px]"
                  style={{
                    color: status?.color,
                  }}
                >
                  <FaCircleCheck className="text-[16px]" /> {status?.label}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-[8px] mt-[12px] mb-[20px] mx-[10px]">
                  <Link
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedCV(item);
                      setShowModal(true);
                    }}
                    className="bg-[linear-gradient(90deg,#00c6ff_0%,#0072ff_100%)] rounded-[4px] font-[400] text-[14px] text-white inline-block py-[8px] px-[20px]"
                  >
                    Xem
                  </Link>
                  <ButtonDelete
                    api={`${process.env.NEXT_PUBLIC_API_URL}/user/cv/delete/${item.id}`}
                    item={item}
                    onDeleteSuccess={() => {
                      mutate(); // Revalidate SWR
                    }}
                  />
                </div>
              </div>
            );
          })}
      </div>

      {/* Phân trang */}
      <div className="mt-[30px]">
        {!loading && totalPage && (
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
      </div>

      {/* Modal hiển thị chi tiết CV */}
      <CVDetailModal
        show={showModal}
        onClose={() => setShowModal(false)}
        data={selectedCV}
      />
    </>
  );
};
