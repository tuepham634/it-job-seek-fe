/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client"

import useSWR from "swr";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { FaLocationDot } from "react-icons/fa6";
import { CardJobItem } from "@/app/components/card/CardJobItem";
import { fetcher } from "@/utils/fetcher";

export default function CompanyDetailPage() {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get("page")) || 1;
  const limit = 6;

  const { data, error, isLoading } = useSWR(
    `/company/detail/${slug}?page=${page}&limit=${limit}`,
    fetcher
  );


  if (isLoading) return <div className="text-center py-10">Đang tải...</div>;

  if (error || data?.code !== "success")
    return <div className="text-center text-red-500 py-10">
      Không tìm thấy công ty!
    </div>;

  const companyDetail = data.companyDetail;
  const jobList = data.jobList;
  const pagination = data.pagination;

  const handlePagination = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPage = Number(e.target.value);
    router.push(`?page=${selectedPage}`, { scroll: false });
  };

  return (
    <div className="pt-[30px] pb-[60px]">
      <div className="container mx-auto px-[16px]">

        {/* --- Thông tin công ty --- */}
        <div className="border border-[#DEDEDE] rounded-[8px] p-[20px]">
          <div className="flex flex-wrap items-center gap-[16px] mb-[20px]">
            <div className="w-[100px]">
              <img
                src={companyDetail.logo}
                alt={companyDetail.companyName}
                className="w-[100%] aspect-square object-contain rounded-[4px]"
              />
            </div>
            <div className="sm:flex-1">
              <h1 className="font-[700] text-[28px] text-[#121212] mb-[10px]">
                {companyDetail.companyName}
              </h1>
              <div className="flex items-center gap-[8px] font-[400] text-[14px] text-[#121212]">
                <FaLocationDot className="text-[16px]" /> {companyDetail.address}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-[10px]">
            <div className="font-[400] text-[16px] text-[#A6A6A6]">
              Mô hình công ty:{" "}
              <span className="text-[#121212]">{companyDetail.companyModel}</span>
            </div>
            <div className="font-[400] text-[16px] text-[#A6A6A6]">
              Quy mô công ty:{" "}
              <span className="text-[#121212]">{companyDetail.companyEmployees}</span>
            </div>
            <div className="font-[400] text-[16px] text-[#A6A6A6]">
              Thời gian làm việc:{" "}
              <span className="text-[#121212]">{companyDetail.workingTime}</span>
            </div>
            <div className="font-[400] text-[16px] text-[#A6A6A6]">
              Làm việc ngoài giờ:{" "}
              <span className="text-[#121212]">{companyDetail.workOvertime}</span>
            </div>
          </div>
        </div>

        {/* --- Mô tả chi tiết --- */}
        <div className="border border-[#DEDEDE] rounded-[8px] p-[20px] mt-[20px]">
          <div dangerouslySetInnerHTML={{ __html: companyDetail.description }} />
        </div>

        {/* --- Danh sách việc làm --- */}
        <div className="mt-[30px]">
          <h2 className="font-[700] text-[28px] text-[#121212] mb-[20px]">
            Công ty có {pagination?.total || jobList.length} việc làm
          </h2>

          <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[20px]">
            {jobList.map((item: any) => (
              <CardJobItem key={item.id} item={item} />
            ))}
          </div>

          {pagination?.totalPages > 1 && (
            <div className="mt-[30px] flex justify-start">
              <select
                name="page"
                defaultValue={page}
                className="border border-[#DEDEDE] rounded-[8px] py-[12px] px-[18px] font-[400] text-[16px] text-[#414042] cursor-pointer"
                onChange={handlePagination}
              >
                {Array.from({ length: pagination.totalPages }, (_, i) => (
                  <option key={i} value={i + 1}>
                    Trang {i + 1}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
