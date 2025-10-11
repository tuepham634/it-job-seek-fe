/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import Link from "next/link"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6"

export const Section1 = () => {
    const [cityList, setCityList] = useState<any[]>([]);
    const router = useRouter();
    const handleSearch = (event: any) => {
        event.preventDefault();
        const city = event.target.city.value;
        const keyword = event.target.keyword.value;

        router.push(`/search?city=${city}&keyword=${keyword}`);

    }
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/city/list`)
            .then((res) => res.json())
            .then((data) => {
                if (data.code === "success") {
                    setCityList(data.cityList)
                }
            })
            .catch((err) => console.error("Lỗi khi tải danh sách thành phố:", err))
    }, [])


    return (
        <>
            <div className="bg-[linear-gradient(90deg,#232526_0%,#414345_100%)] py-[60px] border-t border-gray-700">
                <div className="container mx-auto px-[16px]">
                    <h1 className="text-white font-[700] text-[28px] text-center mb-[30px]">
                        Việc làm IT cho Developer &quot;Chất&quot;
                    </h1>
                    <form
                        onSubmit={handleSearch}
                        action=""
                        className="flex flex-wrap gap-x-[15px] gap-y-[12px] mb-[30px]">
                        <select
                            name="city"
                            className="bg-white md:w-[240px] w-[100%] h-[56px] rounded-[4px] px-[20px] font-[500] text-[16px] text-[#121212]"

                        >
                            <option value="">Tất cả thành phố</option>
                            {cityList.map((city: any) => (
                                <option key={city._id} value={city.name}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                        <input type="text" name="keyword" placeholder="Nhập từ khoá..." className="md:flex-1 flex-none w-[100%] bg-white h-[56px] rounded-[4px] px-[20px] font-[500] text-[16px]" />
                        <button className="bg-[linear-gradient(90deg,#00c6ff_0%,#0072ff_100%)] text-white hover:bg-[#e8fff2] md:w-[240px] w-[100%] h-[56px] rounded-[4px] font-[600] text-[16px] inline-flex items-center justify-center transition">
                            <FaMagnifyingGlass className="text-[20px] mr-[10px]" /> Tìm Kiếm
                        </button>
                    </form>
                    <div className="flex flex-wrap gap-x-[12px] gap-y-[15px] items-center">
                        <div className="text-[#DEDEDE] font-[500] text-[16px]">
                            Mọi người đang tìm kiếm:
                        </div>
                        <div className="flex flex-wrap gap-[10px]">
                            <Link href="#" className="border border-[#414042] bg-[#121212] hover:bg-[#414042] rounded-[20px] inline-block text-[#DEDEDE] hover:text-white font-[500] text-[16px] py-[8px] px-[22px]">
                                ReactJS
                            </Link>
                            <Link href="#" className="border border-[#414042] bg-[#121212] hover:bg-[#414042] rounded-[20px] inline-block text-[#DEDEDE] hover:text-white font-[500] text-[16px] py-[8px] px-[22px]">
                                Javascript
                            </Link>
                            <Link href="#" className="border border-[#414042] bg-[#121212] hover:bg-[#414042] rounded-[20px] inline-block text-[#DEDEDE] hover:text-white font-[500] text-[16px] py-[8px] px-[22px]">
                                NodeJS
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}