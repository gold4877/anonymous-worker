import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Modal from "../../component/Modal";
import Login from "./Login";
import SignUp from "./SignUp";

const AuthModal = ({ open, close, initialTab = "login" }) => {
  const [tab, setTab] = useState(initialTab);
  const navigate = useNavigate();

  // 모달이 열릴 때마다 initialTab으로 리셋
  useEffect(() => {
    if (open) setTab(initialTab);
  }, [open, initialTab]);

  // 회원가입 완료 후 실행
  const handleSignUpClose = () => {
    close(); // 모달 닫기
    navigate("/home"); // 홈으로 이동
  };

  return (
    <Modal open={open} close={close} header="">
      <TabRow>
        <Tab active={tab === "login"} onClick={() => setTab("login")}>
          로그인
        </Tab>
        <Tab active={tab === "signup"} onClick={() => setTab("signup")}>
          회원가입
        </Tab>
      </TabRow>

      {tab === "login" && <Login onClose={close} />}
      {tab === "signup" && (
        <SignUp
          switchToLogin={() => setTab("login")}
          onClose={handleSignUpClose}
        />
      )}
    </Modal>
  );
};

export default AuthModal;

// ─── 스타일 ──────────────────────────────────────────────────
const TabRow = styled.div`
  display: flex;
  border-bottom: 1px solid #e1e1e1;
  margin-bottom: 16px;
`;

const Tab = styled.button`
  flex: 1;
  padding: 12px;
  font-size: 14px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  background: none;
  color: ${(p) => (p.active ? "#1A1A1A" : "#999999")};
  border-bottom: ${(p) =>
    p.active ? "2px solid #1A1A1A" : "2px solid transparent"};
  transition: all 0.15s;
`;
