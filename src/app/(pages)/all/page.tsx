/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AllPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type"); // skill | city | company

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // ✅ State loading

  // 🔹 Danh sách kỹ năng cố định
  const skillList = [
    "HTML", "CSS", "JavaScript", "TypeScript", "ReactJS", "NextJS", "VueJS", "Angular", "Tailwind",
    "NodeJS", "ExpressJS", "Java", "Spring Boot", "Python", "Golang", "PHP",
    "MySQL", "MongoDB", "PostgreSQL", "Redis",
    "Docker", "Kubernetes", "AWS",
    "Git", "Figma", "Agile", "Scrum"
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // ✅ Bắt đầu loading
      setData([]); // Reset data cũ khi đổi type

      try {
        if (type === "skill") {
          setTimeout(() => {
            setData(skillList.map((name) => ({ name })));
            setLoading(false);
          }, 600);
          return;
        }

        let url = "";
        if (type === "city") url = `${process.env.NEXT_PUBLIC_API_URL}/city/list`;
        if (type === "company") url = `${process.env.NEXT_PUBLIC_API_URL}/company/list`;

        if (!url) return;

        const res = await fetch(url);
        const json = await res.json();

        if (json.code === "success") {
          setData(json.cityList || json.companyListFinal || []);
        } else {
          setData([]); // Khi API trả lỗi
        }
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type]);

  const title =
    type === "company"
      ? "Tìm việc làm IT theo tên công ty"
      : type === "city"
      ? "Tất cả thành phố"
      : "Tìm việc làm IT theo kỹ năng";

  const getLink = (item: any) => {
    if (type === "company")
      return `/search?company=${encodeURIComponent(item.companyName)}`;
    if (type === "city")
      return `/search?city=${encodeURIComponent(item.cityName || item.name || item.ten_tinh)}`;
    return `/search?language=${encodeURIComponent(item.name)}`;
  };

  const getName = (item: any) =>
    item.companyName || item.cityName || item.name || item.ten_tinh;

  // ✅ Component Skeleton
  const SkeletonCard = () => (
    <div
      className="h-[80px] bg-white border border-gray-200 rounded-xl shadow-sm animate-pulse"
    >
      <div className="h-full w-full flex items-center justify-center">
        <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f7f7f7] text-black py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          {title}
        </h1>

        {/* Trạng thái hiển thị */}
        {loading ? (
          // 🌀 Đang loading → hiển thị skeleton
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : data.length > 0 ? (
          // ✅ Có dữ liệu → hiển thị danh sách
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {data.map((item, index) => (
              <Link
                key={index}
                href={getLink(item)}
                className="
                  block bg-white border border-gray-200 rounded-xl 
                  shadow-sm hover:shadow-lg hover:border-blue-500 
                  hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100
                  text-center p-5 transition-all duration-300 ease-in-out 
                  transform hover:-translate-y-1
                "
              >
                <span className="block font-semibold text-gray-800 text-[15px] truncate">
                  {getName(item)}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          // ⚠️ Không có dữ liệu
          <p className="text-center text-gray-500 mt-10">
            Không có dữ liệu để hiển thị.
          </p>
        )}
      </div>
    </div>
  );
}
