/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import JustValidate from "just-validate";
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { Toaster, toast } from 'sonner';
import { EditorMCE } from "@/app/components/editor/EditorMCE";
import useSWR from "swr";
import { fetcherWithCredentials } from "@/utils/fetcher";
import { api } from "@/utils/api";

// Đăng ký plugins
registerPlugin(FilePondPluginFileValidateType, FilePondPluginImagePreview);

export const FormProfile = () => {
  const { infoCompany } = useAuth();
  const [logos, setLogos] = useState<any[]>([]);
  const [isValid, setIsValid] = useState(false);
  const editorRef = useRef(null);

  // Lấy danh sách thành phố bằng SWR
  const { data: cityData } = useSWR("/city/list", fetcherWithCredentials);
  const cityList = cityData?.code === "success" ? cityData.cityList : [];

  useEffect(() => {
    if(infoCompany) {
      if(infoCompany.logo) {
        setLogos([{ source: infoCompany.logo }]);
      }

      const validator = new JustValidate("#profileForm");
      validator
        .addField('#companyName', [
          { rule: 'required', errorMessage: 'Vui lòng nhập tên công ty!' },
          { rule: 'maxLength', value: 200, errorMessage: 'Tên công ty không được vượt quá 200 ký tự!' },
        ])
        .addField('#email', [
          { rule: 'required', errorMessage: 'Vui lòng nhập email của bạn!' },
          { rule: 'email', errorMessage: 'Email không đúng định dạng!' },
        ])
        .addField('#phone', [
          { rule: 'required', errorMessage: 'Vui lòng nhập số điện thoại của bạn!' },
          { rule: 'maxLength', value: 15, errorMessage: 'Số điện thoại không được vượt quá 15 ký tự!' },
        ])
        .addField('#address', [
          { rule: 'required', errorMessage: 'Vui lòng nhập địa chỉ của bạn!' },
        ])
        .onFail(() => setIsValid(false))
        .onSuccess(() => setIsValid(true));
    }
  }, [infoCompany]);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if(!isValid) return;

    const companyName = event.target.companyName.value;
    const city = event.target.city.value;
    const address = event.target.address.value;
    const companyModel = event.target.companyModel.value;
    const companyEmployees = event.target.companyEmployees.value;
    const workingTime = event.target.workingTime.value;
    const workOvertime = event.target.workOvertime.value;
    const email = event.target.email.value;
    const phone = event.target.phone.value;

    const description = editorRef.current ? (editorRef.current as any).getContent() : "";

    const logo = logos.length > 0 ? logos[0].file : null;

    const formData = new FormData();
    formData.append("companyName", companyName);
    formData.append("city", city);
    formData.append("address", address);
    formData.append("companyModel", companyModel);
    formData.append("companyEmployees", companyEmployees);
    formData.append("workingTime", workingTime);
    formData.append("workOvertime", workOvertime);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("description", description);
    if(logo) formData.append("logo", logo);

    const promise = api.patch("/company/profile", formData);

    toast.promise(promise, {
      loading: 'Đang cập nhật...',
      success: (data: any) => `${data.message}`,
      error: (err: any) => err?.message || 'Đã xảy ra lỗi!',
    });
  };

  if(!infoCompany) return null;

  return (
    <>
      <Toaster position="top-right" richColors />
      <form onSubmit={handleSubmit} id="profileForm" className="grid sm:grid-cols-2 grid-cols-1 gap-x-[20px] gap-y-[15px]">
        <div className="sm:col-span-2">
          <label htmlFor="companyName" className="block font-[500] text-[14px] text-black mb-[5px]">Tên công ty *</label>
          <input type="text" name="companyName" id="companyName" defaultValue={infoCompany.companyName} className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"/>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="logo" className="block font-[500] text-[14px] text-black mb-[5px]">Logo</label>
          <FilePond name="logo" allowMultiple={false} allowRemove labelIdle='+' acceptedFileTypes={["image/*"]} files={logos} onupdatefiles={setLogos}/>
        </div>
        <div>
          <label htmlFor="city" className="block font-[500] text-[14px] text-black mb-[5px]">Thành phố</label>
          <select name="city" id="city" defaultValue={infoCompany.city} className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black">
            <option value="">-- Chọn thành phố --</option>
            {cityList.map((item: any) => <option key={item._id} value={item._id}>{item.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="address" className="block font-[500] text-[14px] text-black mb-[5px]">Địa chỉ</label>
          <input type="text" name="address" id="address" defaultValue={infoCompany.address} className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"/>
        </div>
        <div>
          <label htmlFor="companyModel" className="block font-[500] text-[14px] text-black mb-[5px]">Mô hình công ty</label>
          <input type="text" name="companyModel" id="companyModel" defaultValue={infoCompany.companyModel} className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"/>
        </div>
        <div>
          <label htmlFor="companyEmployees" className="block font-[500] text-[14px] text-black mb-[5px]">Quy mô công ty</label>
          <input type="text" name="companyEmployees" id="companyEmployees" defaultValue={infoCompany.companyEmployees} className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"/>
        </div>
        <div>
          <label htmlFor="workingTime" className="block font-[500] text-[14px] text-black mb-[5px]">Thời gian làm việc</label>
          <input type="text" name="workingTime" id="workingTime" defaultValue={infoCompany.workingTime} className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"/>
        </div>
        <div>
          <label htmlFor="workOvertime" className="block font-[500] text-[14px] text-black mb-[5px]">Làm việc ngoài giờ</label>
          <input type="text" name="workOvertime" id="workOvertime" defaultValue={infoCompany.workOvertime} className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"/>
        </div>
        <div>
          <label htmlFor="email" className="block font-[500] text-[14px] text-black mb-[5px]">Email *</label>
          <input type="email" name="email" id="email" defaultValue={infoCompany.email} className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"/>
        </div>
        <div>
          <label htmlFor="phone" className="block font-[500] text-[14px] text-black mb-[5px]">Số điện thoại</label>
          <input type="text" name="phone" id="phone" defaultValue={infoCompany.phone} className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"/>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="description" className="block font-[500] text-[14px] text-black mb-[5px]">Mô tả chi tiết</label>
          <EditorMCE editorRef={editorRef} value={infoCompany.description} />
        </div>
        <div className="sm:col-span-2">
          <button className="bg-[linear-gradient(90deg,#00c6ff_0%,#0072ff_100%)] rounded-[4px] h-[48px] px-[20px] font-[700] text-[16px] text-white">Cập nhật</button>
        </div>
      </form>
    </>
  );
};
