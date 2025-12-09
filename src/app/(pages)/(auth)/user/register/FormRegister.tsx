/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { api } from "@/utils/api";
import JustValidate from "just-validate";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export const FormRegister = () => {
  const router = useRouter();

  useEffect(() => {
    const validator = new JustValidate("#registerForm");

    validator
      .addField("#fullName", [
        { rule: "required", errorMessage: "Vui lòng nhập họ tên!" },
        { rule: "minLength", value: 5, errorMessage: "Họ tên phải có ít nhất 5 ký tự!" },
        { rule: "maxLength", value: 50, errorMessage: "Họ tên không được vượt quá 50 ký tự!" },
      ])
      .addField("#email", [
        { rule: "required", errorMessage: "Vui lòng nhập email của bạn!" },
        { rule: "email", errorMessage: "Email không đúng định dạng!" },
      ])
      .addField("#password", [
        { rule: "required", errorMessage: "Vui lòng nhập mật khẩu!" },
        {
          validator: (value: string) => value.length >= 8,
          errorMessage: "Mật khẩu phải chứa ít nhất 8 ký tự!",
        },
        {
          validator: (value: string) => /[A-Z]/.test(value),
          errorMessage: "Mật khẩu phải chứa ít nhất một chữ cái in hoa!",
        },
        {
          validator: (value: string) => /[a-z]/.test(value),
          errorMessage: "Mật khẩu phải chứa ít nhất một chữ cái thường!",
        },
        {
          validator: (value: string) => /\d/.test(value),
          errorMessage: "Mật khẩu phải chứa ít nhất một chữ số!",
        },
        {
          validator: (value: string) => /[@$!%*?&]/.test(value),
          errorMessage: "Mật khẩu phải chứa ít nhất một ký tự đặc biệt!",
        },
      ])
      .onSuccess(async (event: any) => {
        const dataFinal = {
          fullName: event.target.fullName.value,
          email: event.target.email.value,
          password: event.target.password.value,
        };

        const data = await api.post("/user/register", dataFinal);

        if (data.code === "error") {
          alert(data.message);
          return;
        }

        if (data.code === "success") {
          router.push("/user/login");
        }
      });
  }, []);

  return (
    <>
      <form id="registerForm" action="" className="grid grid-cols-1 gap-y-[15px]">
        <div>
          <label htmlFor="fullName" className="block font-[500] text-[14px] text-black mb-[5px]">
            Họ tên *
          </label>
          <input
            type="text"
            name="fullName"
            id="fullName"
            className="w-full h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px]"
          />
        </div>

        <div>
          <label htmlFor="email" className="block font-[500] text-[14px] text-black mb-[5px]">
            Email *
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="w-full h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px]"
          />
        </div>

        <div>
          <label htmlFor="password" className="block font-[500] text-[14px] text-black mb-[5px]">
            Mật khẩu *
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="w-full h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px]"
          />
        </div>

        <div>
          <button className="bg-[linear-gradient(90deg,#00c6ff_0%,#0072ff_100%)] w-full h-[48px] rounded-[4px] font-[700] text-[16px] text-white">
            Đăng ký
          </button>
        </div>
      </form>
    </>
  );
};
