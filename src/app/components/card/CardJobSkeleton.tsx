/* eslint-disable @next/next/no-img-element */
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const CardJobSkeleton = () => {
  return (
    <div
      className="border border-[#DEDEDE] rounded-[8px] flex flex-col relative truncate"
      style={{
        background: "linear-gradient(180deg, #F6F6F6 2.38%, #FFFFFF 70.43%)",
      }}
    >
      {/* Nền background */}
      <img
        src="/assets/images/card-bg.svg"
        alt=""
        className="absolute top-0 left-0 w-full h-auto"
      />

      {/* Logo */}
      <div
        className="relative mt-[20px] w-[116px] h-[116px] bg-white mx-auto rounded-[8px] p-[10px]"
        style={{ boxShadow: "0px 4px 24px 0px #0000001F" }}
      >
        <Skeleton height="100%" />
      </div>

      {/* Tên job */}
      <div className="mt-[20px] mx-[16px] text-center">
        <Skeleton height={20} width="90%" className="mx-auto" />
        <Skeleton height={20} width="60%" className="mx-auto mt-2" />
      </div>

      {/* Tên công ty */}
      <div className="mt-[6px] text-center">
        <Skeleton height={16} width="60%" className="mx-auto" />
      </div>

      {/* Mức lương */}
      <div className="mt-[12px] text-center">
        <Skeleton height={18} width="70%" className="mx-auto" />
      </div>

      {/* Vị trí, hình thức, địa điểm */}
      <div className="mt-[6px] flex flex-col gap-[6px] justify-center items-center">
        <Skeleton height={14} width="80%" />
        <Skeleton height={14} width="70%" />
        <Skeleton height={14} width="60%" />
      </div>

      {/* Tag công nghệ */}
      <div className="mt-[12px] mb-[20px] mx-[16px] flex flex-wrap justify-center gap-[8px]">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} height={24} width={70} borderRadius={20} />
        ))}
      </div>
    </div>
  );
};
