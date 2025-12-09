/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { api } from "@/utils/api";
import JustValidate from "just-validate";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export const FormLogin = () => {
  const router = useRouter();

  useEffect(() => {
    const validator = new JustValidate("#loginForm");

    validator
      .addField('#email', [
        {
          rule: 'required',
          errorMessage: 'Vui lòng nhập email của bạn!',
        },
        {
          rule: 'email',
          errorMessage: 'Email không đúng định dạng!',
        },
      ])
      .addField('#password', [
        {
          rule: 'required',
          errorMessage: 'Vui lòng nhập mật khẩu!',
        },
        {
          validator: (value: string) => value.length >= 8,
          errorMessage: 'Mật khẩu phải chứa ít nhất 8 ký tự!',
        },
        {
          validator: (value: string) => /[A-Z]/.test(value),
          errorMessage: 'Mật khẩu phải chứa ít nhất một chữ cái in hoa!',
        },
        {
          validator: (value: string) => /[a-z]/.test(value),
          errorMessage: 'Mật khẩu phải chứa ít nhất một chữ cái thường!',
        },
        {
          validator: (value: string) => /\d/.test(value),
          errorMessage: 'Mật khẩu phải chứa ít nhất một chữ số!',
        },
        {
          validator: (value: string) => /[@$!%*?&]/.test(value),
          errorMessage: 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt!',
        },
      ])
      .onSuccess(async (event: any) => {
        const email = event.target.email.value;
        const password = event.target.password.value;

        const dataFinal = {
          email,
          password
        };

        try {
          const data = await api.post("/user/login", dataFinal);

          if (data.code === "error") {
            alert(data.message);
          }

          if (data.code === "success") {
            router.push("/");
            console.log("Đăng nhập thành công");
          }
        } catch (error: any) {
          console.error(error);
          alert("Có lỗi xảy ra. Vui lòng thử lại.");
        }
      });
  }, []);

  return (
    <>
      <form id="loginForm" action="" className="grid grid-cols-1 gap-y-[15px]">
        <div className="">
          <label
            htmlFor="email"
            className="block font-[500] text-[14px] text-black mb-[5px]"
          >
            Email *
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
          />
        </div>
        <div className="">
          <label
            htmlFor="password"
            className="block font-[500] text-[14px] text-black mb-[5px]"
          >
            Mật khẩu *
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
          />
        </div>
        <div className="">
          <button className="bg-[linear-gradient(90deg,#00c6ff_0%,#0072ff_100%)] rounded-[4px] w-[100%] h-[48px] px-[20px] font-[700] text-[16px] text-white">
            Đăng nhập
          </button>
        </div>
      </form>
    </>
  );
};
