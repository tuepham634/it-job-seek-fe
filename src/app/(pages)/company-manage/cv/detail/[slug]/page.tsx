"use client";
import { use } from "react";
import { positionList, workingFormList } from "@/config/variable";
import { fetcherWithCredentials } from "@/utils/fetcher";
import Link from "next/link";
import useSWR from "swr";


interface CompanyManageCVDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function CompanyManageCVDetailPage({ params }: CompanyManageCVDetailPageProps) {
  const { slug } = use(params);
  const { data, error, isLoading } = useSWR(`/company/cv/detail/${slug}`, fetcherWithCredentials);

  if (isLoading) return <div className="text-center py-20">Đang tải CV...</div>;
  if (error) return <div className="text-center py-20 text-red-500">Lỗi khi tải CV</div>;
  if (!data || data.code !== "success") return <div className="text-center py-20">Không tìm thấy CV</div>;

  const infoCV = data.infoCV;
  const infoJob = data.infoJob;

  if (infoJob) {
    infoJob.position = positionList.find(item => item.value === infoJob.position)?.label;
    infoJob.workingForm = workingFormList.find(item => item.value === infoJob.workingForm)?.label;
  }

  return (
    <div className="py-[60px]">
      <div className="container mx-auto px-[16px]">
        {/* Thông tin CV */}
        {infoCV && (
          <div className="border border-[#DEDEDE] rounded-[8px] p-[20px]">
            <div className="flex flex-wrap gap-[20px] items-center justify-between mb-[20px]">
              <h2 className="sm:w-auto w-[100%] font-[700] text-[20px] text-black">
                Thông tin CV
              </h2>
              <Link
                href="/company-manage/cv/list"
                className="font-[400] text-[14px] text-[#0088FF] underline"
              >
                Quay lại danh sách
              </Link>
            </div>

            <div className="font-[400] text-[16px] text-black mb-[10px]">
              Họ tên: <span className="font-[700]">{infoCV.fullName}</span>
            </div>
            <div className="font-[400] text-[16px] text-black mb-[10px]">
              Email: <span className="font-[700]">{infoCV.email}</span>
            </div>
            <div className="font-[400] text-[16px] text-black mb-[10px]">
              Số điện thoại: <span className="font-[700]">{infoCV.phone}</span>
            </div>
            <div className="font-[400] text-[16px] text-black mb-[10px]">File CV:</div>
            <div className="bg-[#D9D9D9] h-[736px]">
              <iframe src={infoCV.fileCV} className="w-full h-full"></iframe>
            </div>
          </div>
        )}

        {/* Thông tin công việc */}
        {infoJob && (
          <div className="border border-[#DEDEDE] rounded-[8px] p-[20px] mt-[20px]">
            <h2 className="sm:w-auto w-[100%] font-[700] text-[20px] text-black mb-[20px]">
              Thông tin công việc
            </h2>

            <div className="font-[400] text-[16px] text-black mb-[10px]">
              Tên công việc: <span className="font-[700]">{infoJob.title}</span>
            </div>
            <div className="font-[400] text-[16px] text-black mb-[10px]">
              Mức lương:{" "}
              <span className="font-[700]">
                {infoJob.salaryMin.toLocaleString("vi-VN")}$ - {infoJob.salaryMax.toLocaleString("vi-VN")}$
              </span>
            </div>
            <div className="font-[400] text-[16px] text-black mb-[10px]">
              Cấp bậc: <span className="font-[700]">{infoJob.position}</span>
            </div>
            <div className="font-[400] text-[16px] text-black mb-[10px]">
              Hình thức làm việc: <span className="font-[700]">{infoJob.workingForm}</span>
            </div>
            <div className="font-[400] text-[16px] text-black mb-[10px]">
              Công nghệ: <span className="font-[700]">{infoJob.technologies.join(", ")}</span>
            </div>
            <Link
              href={`/company-manage/job/edit/${infoJob.id}`}
              className="font-[400] text-[14px] text-[#0088FF] underline"
            >
              Xem chi tiết công việc
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
