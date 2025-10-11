/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { cvStatusList, positionList, workingFormList } from "@/config/variable";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaBriefcase, FaCircleCheck, FaUserTie } from "react-icons/fa6";
import { CVDetailModal } from "./CVDetailModal";
import { ButtonDelete } from "@/app/components/button/ButtonDelete";

export const CVList = () => {
  const [listCV, setListCV] = useState<any[]>([]);
  const [selectedCV, setSelectedCV] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState<number>();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/cv/list?page=${page}`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("📦 Dữ liệu trả về từ API /user/cv/list:", data);
        if (data.code === "success") {
          setListCV(data.listCV);
          setTotalPage(data.totalPage);
        }
      })
      .finally(() => setLoading(false));
  }, [page]);
    const handlePagination = (event: any) => {
    const value = event.target.value;
    setPage(parseInt(value));
  };

  // Skeleton card
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
        {/* Hiển thị 3 skeleton khi đang load */}
        {loading &&
          Array.from({ length: 3 }).map((_, idx) => <CVSkeleton key={idx} />)}

        {/* Nếu load xong mà không có dữ liệu */}
        {!loading && listCV.length === 0 && (
          <div className="col-span-full text-center text-gray-500 text-[16px]">
            Không có dữ liệu
          </div>
        )}

        {/* Dữ liệu thật */}
        {!loading &&
          listCV.map((item) => {
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
                  Công ty: <span className="font-[700]">{item.companyName}</span>
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
                    api={`${process.env.NEXT_PUBLIC_API_URL}/user/cv/delete/${item.id}`} // API xóa CV
                    item={item}
                    onDeleteSuccess={(id) => {
                      // Cập nhật danh sách CV sau khi xóa
                      setListCV((prev) => prev.filter((cv) => cv.id !== id));
                    }}
                  />
                </div>
              </div>
            );
          })}
      </div>

      <div className="mt-[30px]">
      {/* Phân trang */}
        {!loading && totalPage && (
          <div className="mt-[30px] flex justify-start">
            <select
              className="border border-[#DEDEDE] rounded-[8px] py-[12px] px-[18px] font-[400] text-[16px] text-[#414042]"
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
