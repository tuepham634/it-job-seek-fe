    /* eslint-disable @typescript-eslint/no-explicit-any */
    "use client";
    import { positionList, workingFormList } from "@/config/variable";
    interface CVDetailModalProps {
    show: boolean;
    onClose: () => void;
    data: any;
    }

    export const CVDetailModal = ({ show, onClose, data }: CVDetailModalProps) => {
    if (!show || !data) return null;
        const jobPositionLabel =
            positionList.find((item) => item.value === data.jobPosition)?.label ||
            data.jobPosition;

        const jobWorkingFormLabel =
            workingFormList.find((item) => item.value === data.jobWorkingForm)?.label ||
            data.jobWorkingForm;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
        <div className="bg-white w-[90%] lg:w-[80%] max-h-[90vh] overflow-y-auto rounded-[12px] p-[20px] grid grid-cols-1 lg:grid-cols-2 gap-[20px] relative animate-fadeIn">
            {/* Nút đóng */}
            <button
            onClick={onClose}
            className="absolute top-[10px] right-[10px] text-[24px] text-red-500 font-bold"
            >
            ×
            </button>

            {/* Thông tin CV */}
            <div className="space-y-[20px]">
            <div className="border border-[#DEDEDE] rounded-[8px] p-[20px]">
                <h3 className="font-[700] text-[20px] mb-[12px]">Thông tin CV</h3>
                <p><strong>Họ tên:</strong> {data.fullName}</p>
                <p><strong>Email:</strong> {data.email}</p>
                <p><strong>Số điện thoại:</strong> {data.phone}</p>
            </div>

            <div className="border border-[#DEDEDE] rounded-[8px] p-[20px]">
                <h3 className="font-[700] text-[20px] mb-[12px]">Thông tin công việc</h3>
                <p><strong>Tên công việc:</strong> {data.jobTitle}</p>
                <p><strong>Mức lương:</strong> {data.jobSalaryMin}$ - {data.jobSalaryMax}$</p>
                <p><strong>Cấp bậc:</strong> {jobPositionLabel}</p>
                <p><strong>Hình thức:</strong> {jobWorkingFormLabel}</p>
                <p><strong>Công nghệ:</strong> {data.jobTech}</p>
                <a href={`/job/detail/${data.jobId}`} className="text-[#0072ff] underline">
                Xem chi tiết công việc
                </a>
            </div>
            </div>

            {/* File PDF */}
            <div>
            <h3 className="font-[700] text-[20px] mb-[12px]">File CV:</h3>
            <iframe
                src={data.fileUrl}
                className="w-full h-[70vh] border rounded-[8px]"
            ></iframe>
            </div>
        </div>
        </div>
    );
    };
