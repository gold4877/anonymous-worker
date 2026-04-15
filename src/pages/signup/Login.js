import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Items } from "../../style/LoginStyle";
import Input from "../../component/Input";
import Button from "../../component/Button";
import styled from "styled-components";
import imgLogo from "../../images/kakaoLion.png";
import AxiosApi from "../../api/AxiosApi";
import Modal from "../../component/Modal";
import { UserContext } from "../../context/UserStore";

const Img = styled.img`
  width: 120px;
  object-fit: cover;
`;

const Login = () => {
  const [inputEmail, setInputEmail] = useState("");
  const [inputPw, setInputPw] = useState("");
  const [isEmail, setIsEmail] = useState(false);
  const [isPw, setIsPw] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const closeModal = () => setModalOpen(false);

  const navigate = useNavigate();
  const { handleLogin } = useContext(UserContext);

  const onChangeEmail = (e) => {
    setInputEmail(e.target.value);
    setIsEmail(e.target.value.length > 5);
  };

  const onChangePw = (e) => {
    setInputPw(e.target.value);
    setIsPw(e.target.value.length >= 4);
  };

  const onClickLogin = async () => {
    try {
      const rsp = await AxiosApi.login(inputEmail, inputPw);
      // mini_project_base 응답 구조: { success, message, data: { userId, email, name, isAdmin } }
      if (rsp.data.success) {
        // Context에 로그인 유저 저장 (localStorage 자동 동기화)
        handleLogin(rsp.data.data);
        navigate("/home");
      } else {
        setModalOpen(true);
        setModalContent(rsp.data.message || "아이디 및 패스워드를 재 확인 해 주세요.");
      }
    } catch (e) {
      setModalOpen(true);
      setModalContent("서버가 응답하지 않습니다.");
    }
  };

  return (
    <Container>
      <Items className="item1">
        <Img src={imgLogo} alt="logo" />
      </Items>
      <Items className="item2">
        <Input
          placeholder="이메일"
          value={inputEmail}
          onChange={onChangeEmail}
        />
      </Items>
      <Items className="item2">
        <Input placeholder="패스워드" value={inputPw} onChange={onChangePw} />
      </Items>
      <Items className="signup">
        <Link to="/signup" className="link_style">
          <span>Sign Up</span>
        </Link>
      </Items>
      <Items className="item2">
        {isEmail && isPw ? (
          <Button enabled onClick={onClickLogin}>
            SIGN IN
          </Button>
        ) : (
          <Button disabled>SIGN IN</Button>
        )}
      </Items>
      <Modal open={modalOpen} close={closeModal} header="오류">
        {modalContent}
      </Modal>
    </Container>
  );
};

export default Login;
