import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AxiosApi from "../../api/AxiosApi";
import Input from "../../component/Input";
import Button from "../../component/Button";
import { Container, Items } from "../../style/LoginStyle";
import Modal from "../../component/Modal";

const Signup = () => {
  const navigate = useNavigate();

  const [inputPw, setInputPw] = useState("");
  const [inputConPw, setInputConPw] = useState("");
  const [inputName, setInputName] = useState("");
  const [inputEmail, setInputEmail] = useState("");

  const [pwMessage, setPwMessage] = useState("");
  const [conPwMessage, setConPwMessage] = useState("");
  const [mailMessage, setMailMessage] = useState("");

  const [isMail, setIsMail] = useState(false);
  const [isPw, setIsPw] = useState(false);
  const [isConPw, setIsConPw] = useState(false);
  const [isName, setIsName] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalText, setModalText] = useState("");
  const closeModal = () => setModalOpen(false);

  const onChangeMail = (e) => {
    setInputEmail(e.target.value);
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(e.target.value)) {
      setMailMessage("이메일 형식이 올바르지 않습니다.");
      setIsMail(false);
    } else {
      setMailMessage("올바른 형식 입니다.");
      setIsMail(true);
      checkEmailDuplicate(e.target.value);
    }
  };

  const onChangePw = (e) => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{4,25}$/;
    setInputPw(e.target.value);
    if (!passwordRegex.test(e.target.value)) {
      setPwMessage("숫자+영문자 조합으로 4자리 이상 입력해주세요!");
      setIsPw(false);
    } else {
      setPwMessage("안전한 비밀번호에요 : )");
      setIsPw(true);
    }
  };

  const onChangeConPw = (e) => {
    setInputConPw(e.target.value);
    if (e.target.value !== inputPw) {
      setConPwMessage("비밀번호가 일치하지 않습니다.");
      setIsConPw(false);
    } else {
      setConPwMessage("비밀번호가 일치합니다. )");
      setIsConPw(true);
    }
  };

  const onChangeName = (e) => {
    setInputName(e.target.value);
    setIsName(e.target.value.length > 0);
  };

  // 이메일 중복 확인
  // mini_project_base 응답: { success, message, data: true/false }
  const checkEmailDuplicate = async (email) => {
    try {
      const rsp = await AxiosApi.checkEmail(email);
      if (rsp.data.success && rsp.data.data) {
        // data: true = 사용 가능
        setMailMessage("사용 가능한 이메일 입니다.");
        setIsMail(true);
      } else {
        setMailMessage("중복된 이메일 입니다.");
        setIsMail(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onClickSignUp = async () => {
    try {
      const rsp = await AxiosApi.signUp(inputEmail, inputPw, inputName);
      // mini_project_base 응답: { success, message, data: null }
      if (rsp.data.success) {
        navigate("/");
      } else {
        setModalOpen(true);
        setModalText(rsp.data.message || "회원 가입에 실패 했습니다.");
      }
    } catch (e) {
      console.log(e);
      setModalOpen(true);
      setModalText("회원 가입에 실패 했습니다.");
    }
  };

  return (
    <Container>
      <Items className="sign">
        <span>Sign Up</span>
      </Items>

      <Items className="item2">
        <Input
          type="email"
          placeholder="이메일"
          value={inputEmail}
          onChange={onChangeMail}
        />
      </Items>
      <Items className="hint">
        {inputEmail.length > 0 && (
          <span className={`${isMail ? "success" : "error"}`}>
            {mailMessage}
          </span>
        )}
      </Items>

      <Items className="item2">
        <Input
          type="password"
          placeholder="패스워드"
          value={inputPw}
          onChange={onChangePw}
        />
      </Items>
      <Items className="hint">
        {inputPw.length > 0 && (
          <span className={`${isPw ? "success" : "error"}`}>{pwMessage}</span>
        )}
      </Items>

      <Items className="item2">
        <Input
          type="password"
          placeholder="패스워드 확인"
          value={inputConPw}
          onChange={onChangeConPw}
        />
      </Items>
      <Items className="hint">
        {inputPw.length > 0 && (
          <span className={`${isConPw ? "success" : "error"}`}>
            {conPwMessage}
          </span>
        )}
      </Items>

      <Items className="item2">
        <Input
          type="text"
          placeholder="이름"
          value={inputName}
          onChange={onChangeName}
        />
      </Items>

      <Items className="item2">
        {isMail && isPw && isConPw && isName ? (
          <Button enabled onClick={onClickSignUp}>
            NEXT
          </Button>
        ) : (
          <Button disabled>NEXT</Button>
        )}
      </Items>

      <Modal open={modalOpen} close={closeModal} header="오류">
        {modalText}
      </Modal>
    </Container>
  );
};

export default Signup;
