import { Outlet, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import styled from "styled-components";
import { UserContext } from "../context/UserStore";
import Header from "../component/Header";
import Footer from "../component/Footer";

const Layout = ({ openAuth, searchValue, onSearch }) => {
  const navigate = useNavigate();
  const { loginUser } = useContext(UserContext);

  // 비로그인 상태로 Layout 접근 시 → 메인으로 + 로그인 모달
  useEffect(() => {
    if (!loginUser) {
      navigate("/");
      if (openAuth) openAuth("login");
    }
  }, [loginUser]);

  return (
    <Container>
      <Header
        openAuth={openAuth}
        searchValue={searchValue}
        onSearch={onSearch}
      />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </Container>
  );
};

export default Layout;

// ─── 스타일 ──────────────────────────────────────────────────
const Container = styled.div`
  min-height: 100vh;
  background: #f2f2f2;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  width: 100%;
`;
