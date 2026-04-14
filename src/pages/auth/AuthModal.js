import { useState } from "react";
import styled from "styled-components";
import Modal from "../../component/Modal";
import Login from "./Login";
import SignUp from "./SignUp";

const TabRow = styled.div`
  display: flex;
  border-bottom: 1px solid #ffffff;
  margin-bottom: 16px;
`;

const Tab = styled.button`
  flex: 1;
  padding: 12px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  background: ${(props) => (props.active ? "#1D6BF3" : "transparent")};
  color: ${(props) => (props.active ? "#FFFFFF" : "#1A1A1A")};
`;

const AuthModal = ({ open, close }) => {
  const [tab, setTab] = useState("login");

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
      {tab === "signup" && <SignUp switchToLogin={() => setTab("login")} />}
    </Modal>
  );
};

export default AuthModal;
