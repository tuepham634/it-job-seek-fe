/* eslint-disable @next/next/no-img-element */
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const CardCompanySkeleton = () => {
  return (
    <div
      className="border border-[#DEDEDE] rounded-[8px] flex flex-col relative truncate"
      style={{
        background: "linear-gradient(180deg, #F6F6F6 2.38%, #FFFFFF 70.43%)",
      }}
    >
      {/* Background overlay */}
      <img
        src="/assets/images/card-bg.svg"
        alt=""
        className="absolute top-0 left-0 w-full h-auto"
      />

      {/* Logo box */}
      <div
        className="relative sm:mt-[32px] mt-[20px] sm:w-[160px] w-[125px] sm:h-[160px] h-[125px] bg-white mx-auto rounded-[8px] p-[10px]"
        style={{
          boxShadow: "0px 4px 24px 0px #0000001F",
        }}
      >
        <Skeleton height="100%" />
      </div>

      {/* Company name */}
      <div className="sm:my-[24px] my-[16px] sm:mx-[16px] mx-[8px] text-center">
        <Skeleton height={20} width="80%" className="mx-auto" />
        <Skeleton height={20} width="60%" className="mx-auto mt-2" />
      </div>

      {/* Footer info */}
      <div className="bg-[#F7F7F7] flex items-center justify-between gap-[12px] py-[12px] px-[16px]">
        <Skeleton height={16} width={60} />
        <Skeleton height={16} width={80} />
      </div>
    </div>
  );
};
