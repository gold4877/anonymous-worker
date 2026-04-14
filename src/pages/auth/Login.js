import { useState, useContext } from "react";
import styled from "styled-components";
import AxiosApi from "../../api/AxiosApi";
import { UserContext } from "../../context/UserStore";
import { useNavigate } from "react-router-dom";
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 10px;
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #1d6bf3;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background-color: #aaa;
    cursor: not-allowed;
  }
`;

const Message = styled.p`
  text-align: center;
  font-size: 13px;
`;

const Login = ({ onClose, switchToSignup }) => {
  const { handleLogin } = useContext(UserContext);

  const [inputEmail, setInputEmail] = useState("");
  const [inputPw, setInputPw] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onClickLogin = async () => {
    if (loading) return; // 중복 방지

    setLoading(true);

    try {
      const rsp = await AxiosApi.login(inputEmail, inputPw);

      if (rsp.data.success) {
        handleLogin(rsp.data.data);

        alert("로그인 성공!");

        // ✅ 모달 닫기
        if (onClose) onClose();

        // ✅ 이동
        navigate("/home");
      } else {
        setErrorMsg(rsp.data.message || "로그인 실패");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  //  Enter 키 로그인
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onClickLogin();
    }
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

      {errorMsg && <Message style={{ color: "red" }}>{errorMsg}</Message>}

      <Button onClick={onClickLogin} disabled={loading}>
        {loading ? "로그인 중..." : "로그인"}
      </Button>
    </Container>
  );
};

export default Login;
