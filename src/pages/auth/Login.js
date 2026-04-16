import { useState, useContext } from "react";
import styled, { keyframes } from "styled-components";
import AxiosApi from "../../api/AxiosApi";
import { UserContext } from "../../context/UserStore";
import { useNavigate } from "react-router-dom";

// ===== 색상 토큰 =====
const COLOR = {
  text: "#1A1A1A",
  textMuted: "#888888",
  accent: "#1D6BF3",
  accentHover: "#155AB5",
  accentGlow: "rgba(29, 107, 243, 0.1)",
  white: "#FFFFFF",
  inputBg: "#F9F9F9",
  border: "#E1E1E1",
  placeholder: "#AAAAAA",
  error: "#DC2626",
  errorBg: "#FEF2F2",
  errorBorder: "#FECACA",
  disabled: "#C0CFE8",
  eyeDefault: "#AAAAAA",
  eyeHover: "#1D6BF3",
};

// ===== 애니메이션 =====
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

// ===== 스타일 =====
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 8px 0 4px;
  animation: ${fadeIn} 0.25s ease;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  color: ${COLOR.text};
  margin: 0 0 4px;
  letter-spacing: -0.5px;
`;

const Subtitle = styled.p`
  text-align: center;
  font-size: 13px;
  color: ${COLOR.textMuted};
  margin: 0 0 4px;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 44px 14px 16px;
  border-radius: 8px;
  border: 1.5px solid ${COLOR.border};
  background-color: ${COLOR.inputBg};
  font-size: 15px;
  color: ${COLOR.text};
  height: 52px;
  box-sizing: border-box;
  transition:
    border-color 0.2s,
    background-color 0.2s,
    box-shadow 0.2s;

  &::placeholder {
    color: ${COLOR.placeholder};
    font-size: 14px;
  }

  &:focus {
    outline: none;
    border-color: ${COLOR.accent};
    background-color: ${COLOR.white};
    box-shadow: 0 0 0 3px ${COLOR.accentGlow};
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const PlainInput = styled(Input)`
  padding-right: 16px;
`;

const EyeButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${COLOR.eyeDefault};
  border-radius: 4px;
  transition: color 0.2s;

  &:hover {
    color: ${COLOR.eyeHover};
  }

  &:focus-visible {
    outline: 2px solid ${COLOR.accentGlow};
  }
`;

const EyeIcon = ({ open }) =>
  open ? (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

const Button = styled.button`
  width: 100%;
  padding: 15px;
  margin-top: 2px;
  background-color: ${({ disabled }) =>
    disabled ? COLOR.disabled : COLOR.accent};
  color: ${COLOR.white};
  border: none;
  border-radius: 8px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.2px;
  transition:
    background-color 0.2s,
    transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover:not(:disabled) {
    background-color: ${COLOR.accentHover};
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
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
  border: 1px solid ${COLOR.errorBorder};
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
  const [showPw, setShowPw] = useState(false);
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
      <Subtitle>서비스를 이용하려면 로그인해주세요</Subtitle>

      {/* 이메일 */}
      <PlainInput
        type="email"
        placeholder="이메일"
        value={inputEmail}
        onChange={(e) => setInputEmail(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
      />

      {/* 비밀번호 + 눈 아이콘 */}
      <InputWrapper>
        <Input
          type={showPw ? "text" : "password"}
          placeholder="비밀번호"
          value={inputPw}
          onChange={(e) => setInputPw(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <EyeButton
          type="button"
          onClick={() => setShowPw((v) => !v)}
          tabIndex={-1}
          aria-label={showPw ? "비밀번호 숨기기" : "비밀번호 보기"}
        >
          <EyeIcon open={showPw} />
        </EyeButton>
      </InputWrapper>

      {errorMsg && <ErrorText>{errorMsg}</ErrorText>}

      <Button onClick={onClickLogin} disabled={loading}>
        {loading && <Spinner />}
        {loading ? "로그인 중..." : "로그인"}
      </Button>
    </Container>
  );
};

export default Login;
