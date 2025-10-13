/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { CardJobItem } from "@/app/components/card/CardJobItem";
import { CardJobSkeleton } from "@/app/components/card/CardJobSkeleton";
import { positionList, workingFormList } from "@/config/variable";
import { motion } from "framer-motion";
import { Briefcase, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

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
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/company/job/list?page=${page}&position=${position}&workingForm=${workingForm}`,
      {
        method: "GET",
        credentials: "include",
      }
    )
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

  const handlePositionChange = (event: any) => {
    setPosition(event.target.value);
    setPage(1);
  };

  const handleWorkingFormChange = (event: any) => {
    setWorkingForm(event.target.value);
    setPage(1);
  };

  return (
    <div className="container mx-auto px-[16px]">
      {/* Tổng số việc làm */}
      {totalRecord && (
        <h2 className="font-[700] text-[28px] text-[#121212] mb-[30px]">
          Bạn đang quản lý {totalRecord} tin tuyển dụng
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

      {/* Danh sách công việc */}
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[20px]">
        {loading ? (
          Array(6)
            .fill(0)
            .map((_, i) => <CardJobSkeleton key={i} />)
        ) : jobList.length > 0 ? (
          jobList.map((item) => <CardJobItem key={item.id} item={item} />)
        ) : (
          <motion.div
            className="col-span-full flex flex-col items-center justify-center py-[100px] text-center bg-white rounded-[12px] shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Briefcase size={80} className="text-gray-400 mb-4" />
            <h3 className="text-[22px] font-semibold text-[#333] mb-2">
              Bạn chưa có tin tuyển dụng nào
            </h3>
            <p className="text-[#777] text-[16px] mb-6 max-w-[400px]">
              Hãy bắt đầu đăng tin đầu tiên để thu hút ứng viên phù hợp với công ty của bạn.
            </p>
            <Link
              href="/company-manage/job/create"
              className="inline-flex items-center gap-2 bg-[#2563EB] text-white px-5 py-3 rounded-[10px] hover:bg-[#1E40AF] transition-colors"
            >
              <PlusCircle size={20} />
              Đăng việc mới
            </Link>
          </motion.div>
        )}
      </div>

      {/* Phân trang */}
      {!loading && totalPage && totalPage > 1 && (
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
  );
};
