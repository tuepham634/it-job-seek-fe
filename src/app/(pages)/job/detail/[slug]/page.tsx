"use client";
/* eslint-disable @next/next/no-img-element */

import { use } from "react";
import useSWR from "swr";
import Link from "next/link";
import { positionList, workingFormList } from "@/config/variable";
import { fetcherWithCredentials } from "@/utils/fetcher";
import { FaArrowRightLong, FaBriefcase, FaLocationDot, FaUserTie } from "react-icons/fa6";
import { FormApply } from "./FormApply";

export default function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  // SWR call API với cookie
  const { data, error, isLoading } = useSWR(`/job/detail/${slug}`, fetcherWithCredentials);

  if (isLoading) return <div className="text-center py-20">Đang tải chi tiết công việc...</div>;
  if (error) return <div className="text-center py-20 text-red-500">Lỗi khi tải chi tiết công việc</div>;
  if (!data || data.code !== "success") return <div className="text-center py-20">Không tìm thấy công việc</div>;

  const jobDetail = data.jobDetail;

  // map position & workingForm
  jobDetail.position = positionList.find(item => item.value === jobDetail.position)?.label;
  jobDetail.workingForm = workingFormList.find(item => item.value === jobDetail.workingForm)?.label;

  return (
    <div className="pt-[30px] pb-[60px]">
      <div className="container mx-auto px-[16px]">
        <div className="flex flex-wrap gap-[20px]">
          {/* Left */}
          <div className="lg:w-[65%] w-[100%]">
            {/* Thông tin công việc */}
            <div className="border border-[#DEDEDE] rounded-[8px] p-[20px]">
              <h1 className="font-[700] sm:text-[28px] text-[24px] text-[#121212] mb-[10px]">
                {jobDetail.title}
              </h1>
              <div className="font-[400] text-[16px] text-[#414042] mb-[10px]">
                {jobDetail.companyName}
              </div>
              <div className="font-[700] text-[20px] bg-gradient-to-r from-[#134e5e] via-[#71b280] to-[#00ff7f] text-transparent bg-clip-text sm:mb-[20px] mb-[10px]">
                {jobDetail.salaryMin}$ - {jobDetail.salaryMax}$
              </div>
              <Link
                href="#apply-form"
                className="bg-[linear-gradient(90deg,#00c6ff_0%,#0072ff_100%)] rounded-[4px] font-[700] text-[16px] text-white flex items-center justify-center h-[48px] mb-[20px]"
              >
                Ứng tuyển
              </Link>

              <div className="grid grid-cols-3 sm:gap-[16px] gap-[8px] mb-[20px]">
                {jobDetail.images?.map((image: string, idx: number) => (
                  <img
                    key={idx}
                    src={image}
                    alt=""
                    className="aspect-[232/145] object-contain rounded-[4px] w-full"
                  />
                ))}
              </div>

              <div className="flex items-center gap-[8px] font-[400] text-[14px] text-[#121212] mb-[10px]">
                <FaUserTie className="text-[16px]" /> {jobDetail.position}
              </div>
              <div className="flex items-center gap-[8px] font-[400] text-[14px] text-[#121212] mb-[10px]">
                <FaBriefcase className="text-[16px]" /> {jobDetail.workingForm}
              </div>
              <div className="flex items-center gap-[8px] font-[400] text-[14px] text-[#121212] mb-[10px]">
                <FaLocationDot className="text-[16px]" /> {jobDetail.companyAddress}
              </div>
              <div className="flex flex-wrap gap-[8px]">
                {jobDetail.technologies?.map((tech: string, idx: number) => (
                  <div
                    key={idx}
                    className="border border-[#DEDEDE] rounded-[20px] font-[400] text-[12px] text-[#414042] py-[6px] px-[16px]"
                  >
                    {tech}
                  </div>
                ))}
              </div>
            </div>

            {/* Mô tả chi tiết */}
            <div className="border border-[#DEDEDE] rounded-[8px] p-[20px] mt-[20px]">
              <div dangerouslySetInnerHTML={{ __html: jobDetail.description }} />
            </div>

            {/* Form ứng tuyển */}
            <FormApply jobId={jobDetail.id} />
          </div>

          {/* Right */}
          <div className="flex-1">
            <div className="border border-[#DEDEDE] rounded-[8px] p-[20px]">
              <div className="flex gap-[12px]">
                <div className="w-[100px]">
                  <img
                    src={jobDetail.companyLogo}
                    alt={jobDetail.companyName}
                    className="aspect-square object-contain rounded-[4px]"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-[700] text-[18px] text-[#121212] mb-[10px]">
                    {jobDetail.companyName}
                  </div>
                  <Link
                    href={`/company/detail/${jobDetail.companyId}`}
                    className="flex items-center gap-[8px] font-[400] text-[16px] text-[#121212]"
                  >
                    Xem công ty <FaArrowRightLong />
                  </Link>
                </div>
              </div>

              <div className="mt-[20px] flex flex-col gap-[10px]">
                <div className="flex flex-wrap justify-between font-[400] text-[16px]">
                  <div className="text-[#A6A6A6]">Mô hình công ty</div>
                  <div className="text-[#121212]">{jobDetail.companyModel}</div>
                </div>
                <div className="flex flex-wrap justify-between font-[400] text-[16px]">
                  <div className="text-[#A6A6A6]">Quy mô công ty</div>
                  <div className="text-[#121212]">{jobDetail.companyEmployees}</div>
                </div>
                <div className="flex flex-wrap justify-between font-[400] text-[16px]">
                  <div className="text-[#A6A6A6]">Thời gian làm việc</div>
                  <div className="text-[#121212]">{jobDetail.companyWorkingTime}</div>
                </div>
                <div className="flex flex-wrap justify-between font-[400] text-[16px]">
                  <div className="text-[#A6A6A6]">Làm việc ngoài giờ</div>
                  <div className="text-[#121212]">{jobDetail.companyWorkOvertime}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
