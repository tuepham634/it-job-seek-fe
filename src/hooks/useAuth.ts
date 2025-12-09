/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { api } from "@/utils/api";

export const useAuth = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [infoUser, setInfoUser] = useState<any>();
  const [infoCompany, setInfoCompany] = useState<any>();
  const pathname = usePathname(); 

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await api.get("/auth/check");

        if(data.code === "success") {
          setIsLogin(true);
          if(data.infoUser){
            setInfoUser(data.infoUser);
            setInfoCompany(null);
          }
          if(data.infoCompany){
            setInfoCompany(data.infoCompany);
            setInfoUser(null);
          }
        } else {
          setIsLogin(false);
          setInfoUser(null);
          setInfoCompany(null);
        }
      } catch(err: any) {
        setIsLogin(false);
        setInfoUser(null);
        setInfoCompany(null);
        console.error("Auth check failed:", err.message);
      }
    };

    checkAuth();
  }, [pathname]);

  return { isLogin, infoUser, infoCompany };
};
