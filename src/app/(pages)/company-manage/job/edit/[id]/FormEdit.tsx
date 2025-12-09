
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { useEffect, useRef, useState } from 'react';
import { Toaster, toast } from 'sonner';
import { EditorMCE } from "@/app/components/editor/EditorMCE";
import JustValidate from 'just-validate';
import { positionList, workingFormList } from '@/config/variable';
import { api } from "@/utils/api";
import useSWR from "swr";
import { fetcherWithCredentials } from "@/utils/fetcher";

registerPlugin(FilePondPluginFileValidateType, FilePondPluginImagePreview);

export const FormEdit = ({ id }: { id: string }) => {
  const editorRef = useRef(null);
  const [isValid, setIsValid] = useState(false);
  const [images, setImages] = useState<any[]>([]);

  const { data, error, isLoading } = useSWR(`/company/job/edit/${id}`, fetcherWithCredentials);

  useEffect(() => {
    if (data?.code === "success") {
      const jobDetail = data.jobDetail;

      if (jobDetail.images && jobDetail.images.length > 0) {
        setImages(jobDetail.images.map((img: string) => ({ source: img })));
      }

      const validator = new JustValidate("#editForm");
      validator
        .addField('#title', [{ rule: 'required', errorMessage: 'Vui lòng nhập tên công việc!' }])
        .addField('#salaryMin', [{ rule: 'minNumber', value: 0, errorMessage: 'Vui lòng nhập mức lương >= 0' }])
        .addField('#salaryMax', [{ rule: 'minNumber', value: 0, errorMessage: 'Vui lòng nhập mức lương >= 0' }])
        .onFail(() => setIsValid(false))
        .onSuccess(() => setIsValid(true));
    } else if (data?.code === "error") {
      toast.error(data.message);
    }
  }, [data]);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (!isValid) return;

    const title = event.target.title.value;
    const salaryMin = event.target.salaryMin.value;
    const salaryMax = event.target.salaryMax.value;
    const position = event.target.position.value;
    const workingForm = event.target.workingForm.value;
    const technologies = event.target.technologies.value;

    let description = '';
    if (editorRef.current) description = (editorRef.current as any).getContent();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("salaryMin", salaryMin);
    formData.append("salaryMax", salaryMax);
    formData.append("position", position);
    formData.append("workingForm", workingForm);
    formData.append("technologies", technologies);
    formData.append("description", description);

    images.forEach(image => formData.append("images", image.file));

    const promise = api.patch(`/company/job/edit/${id}`, formData);

    toast.promise(promise, {
      loading: 'Đang cập nhật...',
      success: (data: any) => `${data.message}`,
      error: (err: any) => err?.message || 'Đã xảy ra lỗi!',
    });
  };

  if (isLoading) return <p className="text-center py-10">Đang tải chi tiết công việc...</p>;
  if (error) return <p className="text-center py-10 text-red-500">Lỗi khi tải dữ liệu</p>;
  if (!data || data.code !== "success") return <p className="text-center py-10">Không tìm thấy công việc</p>;

  const jobDetail = data.jobDetail;

  return (
    <>
      <Toaster position="top-right" richColors />
      <form onSubmit={handleSubmit} id="editForm" className="grid sm:grid-cols-2 grid-cols-1 gap-x-[20px] gap-y-[15px]">
        <div className="sm:col-span-2">
          <label htmlFor="title" className="block font-[500] text-[14px] text-black mb-[5px]">Tên công việc *</label>
          <input type="text" name="title" id="title" defaultValue={jobDetail.title} className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"/>
        </div>
        <div>
          <label htmlFor="salaryMin" className="block font-[500] text-[14px] text-black mb-[5px]">Mức lương tối thiểu ($)</label>
          <input type="number" name="salaryMin" id="salaryMin" defaultValue={jobDetail.salaryMin} className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"/>
        </div>
        <div>
          <label htmlFor="salaryMax" className="block font-[500] text-[14px] text-black mb-[5px]">Mức lương tối đa ($)</label>
          <input type="number" name="salaryMax" id="salaryMax" defaultValue={jobDetail.salaryMax} className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"/>
        </div>
        <div>
          <label htmlFor="position" className="block font-[500] text-[14px] text-black mb-[5px]">Cấp bậc *</label>
          <select name="position" id="position" defaultValue={jobDetail.position} className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black">
            {positionList.map((item, idx) => <option key={idx} value={item.value}>{item.label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="workingForm" className="block font-[500] text-[14px] text-black mb-[5px]">Hình thức làm việc *</label>
          <select name="workingForm" id="workingForm" defaultValue={jobDetail.workingForm} className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black">
            {workingFormList.map((item, idx) => <option key={idx} value={item.value}>{item.label}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="technologies" className="block font-[500] text-[14px] text-black mb-[5px]">Các công nghệ</label>
          <input type="text" name="technologies" id="technologies" defaultValue={jobDetail.technologies.join(", ")} className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"/>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="images" className="block font-[500] text-[14px] text-black mb-[5px]">Danh sách ảnh *</label>
          <FilePond name="images" allowMultiple allowRemove labelIdle='+' acceptedFileTypes={["image/*"]} files={images} onupdatefiles={setImages} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="description" className="block font-[500] text-[14px] text-black mb-[5px]">Mô tả chi tiết</label>
          <EditorMCE editorRef={editorRef} id="description" value={jobDetail.description}/>
        </div>
        <div className="sm:col-span-2">
          <button className="bg-[linear-gradient(90deg,#00c6ff_0%,#0072ff_100%)] rounded-[4px] h-[48px] px-[20px] font-[700] text-[16px] text-white">
            Cập nhật
          </button>
        </div>
      </form>
    </>
  );
};
