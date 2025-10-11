/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaAngleDown, FaAngleRight } from "react-icons/fa6";

export const HeaderMenu = (props: { showMenu: boolean }) => {
  const { showMenu } = props;
  const { isLogin } = useAuth();

  const [topCompanies, setTopCompanies] = useState<any[]>([]);
  const [cityList, setCityList] = useState<any[]>([]);

  useEffect(() => {
    // Fetch công ty
    const fetchCompanies = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/list`);
        if (!res.ok) throw new Error(`Lỗi HTTP: ${res.status}`);
        const data = await res.json();
        if (data.code === "success") {
          setTopCompanies(data.companyListFinal);
        } else {
          console.warn("API công ty trả về lỗi:", data);
        }
      } catch (err) {
        console.error("Lỗi khi fetch danh sách công ty IT:", err);
      }
    };

    // Fetch thành phố
    const fetchCities = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/city/list`);
        if (!res.ok) throw new Error(`Lỗi HTTP: ${res.status}`);
        const data = await res.json();
        if (data.code === "success") {
          setCityList(data.cityList);
        } else {
          console.warn("API thành phố trả về lỗi:", data);
        }
      } catch (err) {
        console.error("Lỗi khi fetch danh sách thành phố:", err);
      }
    };

    fetchCompanies();
    fetchCities();
  }, []);

  const displayedCompanies = topCompanies.slice(0, 10);
  const displayedCities = cityList.slice(0, 4);

  const menuList = [
    {
      name: "Việc Làm IT",
      link: "#",
      children: [
        {
          name: "Việc làm IT theo kỹ năng",
          link: "#",
          children: [
            { name: "HTML", link: "/search?language=HTML" },
            { name: "CSS", link: "/search?language=CSS" },
            { name: "JavaScript", link: "/search?language=JAVASCRIPT" },
            { name: "ReactJS", link: "/search?language=ReactJS" },
            { name: "NodeJS", link: "/search?language=NodeJS" },
            { name: "Xem tất cả kỹ năng", link: "/all?type=skill" },
          ],
        },
        {
          name: "Việc làm IT theo thành phố",
          link: "#",
          children: [
            ...displayedCities.map((city: any) => ({
              name: city.cityName || city.name || city.ten_tinh,
              link: `/search?city=${encodeURIComponent(
                city.cityName || city.name || city.ten_tinh
              )}`,
            })),
            { name: "Xem tất cả thành phố", link: "/all?type=city" },
          ],
        },
      ],
    },
    {
      name: "Top Công Ty IT",
      link: "/company/list",
      children: [
        ...displayedCompanies.map((company) => ({
          name: company.companyName,
          link: `/search?company=${encodeURIComponent(company.companyName)}`,
        })),
        { name: "Xem tất cả công ty", link: "/all?type=company" },
      ],
    },
    {
      name: "Nhà Tuyển Dụng",
      link: "#",
      isLogin: false,
      children: [
        { name: "Đăng Nhập", link: "/company/login" },
        { name: "Đăng Ký", link: "/company/register" },
      ],
    },
  ];

  return (
    <>
      <nav
        className={
          "lg:block " +
          (showMenu
            ? "fixed top-0 left-0 w-[300px] h-[100vh] z-[999] bg-[linear-gradient(90deg,#232526_0%,#414345_100%)]"
            : "hidden")
        }
      >
        <ul className="flex gap-x-[30px] flex-wrap">
          {menuList.map((menu, index) => (
            <li
              key={index}
              className={
                "inline-flex lg:w-auto w-full lg:justify-start justify-between p-[10px] items-center gap-x-[8px] relative group/sub-1 flex-wrap " +
                (menu.isLogin !== undefined && menu.isLogin !== isLogin
                  ? "hidden"
                  : "")
              }
            >
              <Link
                href={menu.link}
                className="text-white font-[600] text-[16px]"
              >
                {menu.name}
              </Link>

              {menu.children && (
                <FaAngleDown className="text-white text-[16px]" />
              )}

              {menu.children && (
                <ul className="lg:absolute relative lg:top-[100%] top-0 left-[0px] lg:w-[420px] w-full bg-[linear-gradient(90deg,#232526_0%,#414345_100%)] hidden group-hover/sub-1:block z-[999] p-[10px] rounded-[6px]">
                  {/* Nếu là danh sách công ty thì hiển thị dạng grid */}
                  {menu.name === "Top Công Ty IT" ? (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                      {menu.children.map((menuSub, idx) => (
                        <div
                          key={idx}
                          className={`py-[6px] px-[8px] rounded-[4px] hover:bg-[rgba(255,255,255,0.1)] cursor-pointer ${
                            menuSub.name.includes("Xem tất cả")
                              ? "col-span-full text-center font-semibold text-yellow-300 justify-self-center"
                              : ""
                          }`}
                        >
                          <Link
                            href={menuSub.link}
                            className="text-white font-[500] text-[14px]"
                          >
                            {menuSub.name}
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Các menu khác
                    menu.children.map((menuSub1, indexSub1) => (
                      <li
                        key={indexSub1}
                        className="py-[10px] px-[16px] rounded-[4px] flex items-center justify-between hover:bg-[rgba(255,255,255,0.1)] relative group/sub-2 flex-wrap"
                      >
                        <Link
                          href={menuSub1.link}
                          className="text-white font-[600] text-[16px]"
                        >
                          {menuSub1.name}
                        </Link>

                        {"children" in menuSub1 && menuSub1.children && (
                          <FaAngleRight className="text-white text-[16px]" />
                        )}

                        {"children" in menuSub1 && menuSub1.children && (
                          <ul className="lg:absolute relative top-[0px] lg:left-[100%] left-0 lg:w-[280px] w-full bg-[linear-gradient(90deg,#232526_0%,#414345_100%)] hidden group-hover/sub-2:block z-[999]">
                            {menuSub1.children.map((menuSub2, indexSub2) => (
                              <li
                                key={indexSub2}
                                className={`py-[10px] px-[16px] rounded-[4px] flex items-center justify-between hover:bg-[rgba(255,255,255,0.1)] ${
                                  menuSub2.name.includes("Xem tất cả")
                                    ? "text-yellow-300 font-semibold"
                                    : ""
                                }`}
                              >
                                <Link
                                  href={menuSub2.link}
                                  className="text-white font-[600] text-[16px]"
                                >
                                  {menuSub2.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))
                  )}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};
