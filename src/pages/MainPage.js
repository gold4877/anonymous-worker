import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ButtonContainer, TransBtn } from "../style/ButtonStyle";
import { UserContext } from "../context/UserStore";

const Home = () => {
  const navigate = useNavigate();
  const { loginUser } = useContext(UserContext);

  // ✅ Hook은 반드시 조건부 return 전에 선언
  useEffect(() => {
    if (!loginUser) {
      navigate("/");
    }
  }, [loginUser, navigate]);

  if (!loginUser) return null;

  const onClickBtn = (path) => {
    navigate(path);
  };

  return (
    <div>
      <ButtonContainer>
        <TransBtn onClick={() => onClickBtn("/members")}>회원 리스트</TransBtn>
        <TransBtn onClick={() => onClickBtn("/boards")}>게시판</TransBtn>
        <TransBtn onClick={() => onClickBtn("/themeSetting")}>테마 설정</TransBtn>
      </ButtonContainer>
    </div>
  );
};

export default Home;
