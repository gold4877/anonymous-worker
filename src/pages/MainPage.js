import { useNavigate } from "react-router-dom";
import { ButtonContainer, TransBtn } from "../style/ButtonStyle";
import styled from "styled-components";

const Home = ({ openAuth }) => {
  const navigate = useNavigate();

  const onClickBtn = (path) => {
    navigate(path);
  };

  // 테스트용 버튼
  const TestLoginBtn = styled.button`
    margin-top: 40px;
    padding: 12px 20px;
    background-color: #1d6bf3;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  `;

  return (
    <div>
      <ButtonContainer>
        <TransBtn onClick={() => onClickBtn("/members")}>회원 리스트</TransBtn>
        <TransBtn onClick={() => onClickBtn("/boards")}>게시판</TransBtn>

        <TransBtn onClick={() => onClickBtn("/themeSetting")}>
          테마 설정
        </TransBtn>
        {/* 🔽 테스트용 로그인 버튼 */}
        <div style={{ textAlign: "center" }}>
          <TestLoginBtn onClick={openAuth}>로그인 / 회원가입</TestLoginBtn>
        </div>
      </ButtonContainer>
    </div>
  );
};

export default Home;
