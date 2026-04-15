import { useState, useContext } from "react";
import styled, { keyframes } from "styled-components";
import AxiosApi from "../../api/AxiosApi";
import { UserContext } from "../../context/UserStore";
import { useNavigate } from "react-router-dom";

// ===== 색상 토큰 =====
const COLOR = {
  text: "#1A1A1A",
  accent: "#1D6BF3",
  accentHover: "#155AB5",
  white: "#FFFFFF",
  bg: "#F5F5F5",
  inputBg: "#EEEEEE",
  border: "#E1E1E1",
  placeholder: "#999999",
  error: "#E53E3E",
  errorBg: "#FFE5E5",
  disabled: "#CCCCCC",
};

// ===== 스타일 =====
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 8px 0 4px;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  color: ${COLOR.text};
  margin: 0 0 8px;
  letter-spacing: -0.5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border-radius: 8px;
  border: 1.5px solid ${COLOR.border};
  background-color: ${COLOR.inputBg};
  font-size: 15px;
  color: ${COLOR.text};
  transition:
    border-color 0.2s,
    background-color 0.2s;

  &::placeholder {
    color: ${COLOR.placeholder};
  }

  &:focus {
    outline: none;
    border-color: ${COLOR.accent};
    background-color: ${COLOR.white};
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 15px;
  margin-top: 4px;
  background-color: ${({ disabled }) =>
    disabled ? COLOR.disabled : COLOR.accent};
  color: ${COLOR.white};
  border: none;
  border-radius: 8px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.2px;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover:not(:disabled) {
    background-color: ${COLOR.accentHover};
  }
`;

const ErrorText = styled.p`
  color: ${COLOR.error};
  font-size: 13px;
  text-align: center;
  margin: 0;
  padding: 10px 12px;
  background-color: ${COLOR.errorBg};
  border-radius: 6px;
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: ${COLOR.white};
  border-radius: 50%;
  animation: ${spin} 0.6s linear infinite;
  flex-shrink: 0;
`;

// ===== 컴포넌트 =====
const Login = ({ onClose, switchToSignup }) => {
  const { handleLogin } = useContext(UserContext);
  const navigate = useNavigate();

  const [inputEmail, setInputEmail] = useState("");
  const [inputPw, setInputPw] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const onClickLogin = async () => {
    if (!inputEmail || !inputPw) {
      setErrorMsg("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const rsp = await AxiosApi.login(inputEmail, inputPw);

      if (rsp.data.success) {
        handleLogin(rsp.data.data);
        if (onClose) onClose();
        navigate("/home");
      } else {
        setErrorMsg("아이디 또는 비밀번호가 틀렸습니다.");
      }
    } catch (error) {
      setErrorMsg(
        error.response
          ? "아이디 또는 비밀번호가 틀렸습니다."
          : "서버 오류가 발생했습니다.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") onClickLogin();
  };

  return (
    <Container>
      <Title>로그인</Title>

      <Input
        type="email"
        placeholder="이메일"
        value={inputEmail}
        onChange={(e) => setInputEmail(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <Input
        type="password"
        placeholder="비밀번호"
        value={inputPw}
        onChange={(e) => setInputPw(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      {errorMsg && <ErrorText>{errorMsg}</ErrorText>}

      <Button onClick={onClickLogin} disabled={loading}>
        {loading && <Spinner />}
        {loading ? "로그인 중..." : "로그인"}
      </Button>
    </Container>
  );
};

export default Login;
