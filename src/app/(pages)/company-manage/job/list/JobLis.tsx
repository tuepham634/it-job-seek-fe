/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { CardJobItem } from "@/app/components/card/CardJobItem";
import { CardJobSkeleton } from "@/app/components/card/CardJobSkeleton";
import { positionList, workingFormList } from "@/config/variable";
import { useEffect, useState } from "react";

export const JobList = () => {
  const [jobList, setJobList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState<number>();
  const [totalRecord, setTotalRecord] = useState<number>();
  const [loading, setLoading] = useState(true);
  const [position, setPosition] = useState("");
  const [workingForm, setWorkingForm] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/job/list?page=${page}&position=${position}&workingForm=${workingForm}`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "success") {
          setJobList(data.jobs);
          setTotalPage(data.totalPage);
          setTotalRecord(data.totalRecord);
        }
      })
      .catch((err) => console.error("Fetch jobs error:", err))
      .finally(() => setLoading(false));
  }, [page, position, workingForm]);

  const handlePagination = (event: any) => {
    const value = event.target.value;
    setPage(parseInt(value));
  };
    // Xử lý chọn vị trí
  const handlePositionChange = (event: any) => {
    setPosition(event.target.value);
    setPage(1); // reset về trang đầu
  };

  // Xử lý chọn hình thức làm việc
  const handleWorkingFormChange = (event: any) => {
    setWorkingForm(event.target.value);
    setPage(1); // reset về trang đầu
  };
  return (
    <div className="container mx-auto px-[16px]">
      {/* Tổng số việc làm */}
      {totalRecord && (
        <h2 className="font-[700] text-[28px] text-[#121212] mb-[30px]">
          Có tổng cộng {totalRecord} việc làm đang đăng tuyển
        </h2>
      )}

      {/* Bộ lọc */}
      <div
        className="bg-white rounded-[8px] py-[10px] px-[20px] mb-[30px] flex flex-wrap gap-[12px]"
        style={{ boxShadow: "0px 4px 20px 0px #0000000F" }}
      >
        <select
          className="border border-[#DEDEDE] rounded-[20px] h-[36px] px-[18px] font-[400] text-[16px] text-[#414042]"
          value={position}
          onChange={handlePositionChange}
        >
          <option value="">Chọn vị trí</option>
          {positionList.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <select
          className="border border-[#DEDEDE] rounded-[20px] h-[36px] px-[18px] font-[400] text-[16px] text-[#414042]"
          value={workingForm}
          onChange={handleWorkingFormChange}
        >
          <option value="">Hình thức làm việc</option>
          {workingFormList.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      {/* Danh sách việc làm */}
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[20px]">
        {loading
          ? Array(6)
              .fill(0)
              .map((_, i) => <CardJobSkeleton key={i} />)
          : jobList.map((item) => <CardJobItem key={item.id} item={item} />)}
      </div>

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
  );
};
