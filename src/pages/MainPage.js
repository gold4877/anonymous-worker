import { useNavigate, Navigate } from "react-router-dom";
import { ButtonContainer, TransBtn } from "../style/ButtonStyle";
import styled from "styled-components";
import { useContext } from "react";
import { UserContext } from "../context/UserStore";

const Home = ({ openAuth }) => {
  const { loginUser } = useContext(UserContext);
  const navigate = useNavigate();

  const onClickBtn = (path) => {
    navigate(path);
  };

  return (
    <div>
      <div>
        <p>
          로그인한 유저가 관리자면 admin 이동 버튼이 나타나게 해두었음
          <br />
          관리자여부(true/false)는 현재로선 따로 지정할 방법이 없고 DB에서 직접
          입력해줘야함
          <br />
          loginUser.admin 으로 true/false 값 불러올 수 있음
        </p>
        {!loginUser.admin && (
          <button
            onClick={() => {
              navigate("/admin");
            }}
          >
            admin 이동
          </button>
        )}
      </div>
      {/* 로그인 / 회원가입 버튼 분리 */}
      <BtnRow>
        <LoginBtn onClick={() => openAuth && openAuth("login")}>
          로그인
        </LoginBtn>
        <SignUpBtn onClick={() => openAuth && openAuth("signup")}>
          회원가입
        </SignUpBtn>
      </BtnRow>
    </div>
  );
};

export default Home;

// ─── 스타일 ──────────────────────────────────────────────────
const BtnRow = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 40px;
`;

const LoginBtn = styled.button`
  padding: 10px 20px;
  border: 1px solid #e1e1e1;
  border-radius: 6px;
  background: #ffffff;
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
  cursor: pointer;
  &:hover {
    background: #f5f5f5;
  }
`;

const SignUpBtn = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  background: #1d6bf3;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  cursor: pointer;
  &:hover {
    background: #1558d0;
  }
`;
