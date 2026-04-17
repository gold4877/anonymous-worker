import { createContext, useEffect, useState } from "react";
import AxiosApi from "../api/AxiosApi";
export const UserContext = createContext(null);

/**
 * 전역 상태 관리 Context
 *
 * [로그인 정보] localStorage "loginUser" 키로 저장
 *   { userId, email, name, isAdmin }
 *
 * [테마 색상] localStorage "bgcolor" 키로 저장
 */
const UserStore = (props) => {
  // 테마 색상
  const [color, setColor] = useState(
    localStorage.getItem("bgcolor") || "orange",
  );

  // 로그인 유저 정보 (로그인 성공 시 서버 응답 data를 그대로 저장)
  const [loginUser, setLoginUser] = useState(() => {
    const saved = localStorage.getItem("loginUser");
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    // 구버전 호환: "admin" 필드 → "isAdmin" 으로 자동 변환
    if (parsed.admin !== undefined && parsed.isAdmin === undefined) {
      parsed.isAdmin = parsed.admin;
    }
    return parsed;
  });

  // 임시 추가
  const refreshUserInfo = async () => {
    if (!loginUser || !loginUser.userId) return;

    try {
      const rsp = await AxiosApi.getUser(loginUser.userId);
      if (rsp.data.success) {
        const updatedUser = rsp.data.data;
        // 구버전 호환: "admin" 필드 → "isAdmin" 으로 자동 변환
        if (
          updatedUser.admin !== undefined &&
          updatedUser.isAdmin === undefined
        ) {
          updatedUser.isAdmin = updatedUser.admin;
        }

        setLoginUser(updatedUser);

        localStorage.setItem("loginUser", JSON.stringify(updatedUser));
      }
    } catch (e) {
      console.error("유저 정보 동기화 실패: ", e);
    }
  };

  // 색상 변경 시 localStorage 동기화
  useEffect(() => {
    localStorage.setItem("bgcolor", color);
  }, [color]);

  // 로그인 유저 변경 시 localStorage 동기화
  useEffect(() => {
    if (loginUser) {
      localStorage.setItem("loginUser", JSON.stringify(loginUser));
    } else {
      localStorage.removeItem("loginUser");
      localStorage.removeItem("isLogin");
    }
  }, [loginUser]);

  // 로그인 처리 (서버 응답 data 전체를 저장)
  const handleLogin = (userData) => {
    setLoginUser(userData);
    localStorage.setItem("isLogin", "TRUE");
  };

  // 로그아웃 처리
  const handleLogout = () => {
    setLoginUser(null);
    localStorage.removeItem("loginUser");
    localStorage.removeItem("isLogin");
    localStorage.removeItem("email"); // 기존 호환성 유지
  };

  useEffect(() => {
    if (loginUser) {
      refreshUserInfo();
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        color,
        setColor,
        loginUser,
        setLoginUser,
        handleLogin,
        handleLogout,
        refreshUserInfo,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserStore;
