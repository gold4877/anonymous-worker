import { ButtonContainer, TransBtn } from "../../style/ButtonStyle";
import { useContext } from "react"; // 리액트에서 제공하는 전역 상태관리 Hook 함수
import { UserContext } from "../../context/UserStore"; // 우리가 만든거

const ThemeSetting = () => {
  const context = useContext(UserContext);
  const { setColor } = context;
  const themeColorChange = (color) => {
    setColor(color);
  };
  return (
    <>
      <ButtonContainer>
        <TransBtn>테마 설정</TransBtn>
      </ButtonContainer>
      <ButtonContainer>
        <TransBtn color="orange" onClick={() => themeColorChange("orange")}>
          오렌지
        </TransBtn>
        <TransBtn color="green" onClick={() => themeColorChange("green")}>
          그린
        </TransBtn>
        <TransBtn
          color="lightgrey"
          onClick={() => themeColorChange("lightgrey")}
        >
          밝은 회색
        </TransBtn>
        <TransBtn color="grey" onClick={() => themeColorChange("grey")}>
          어두운 회색
        </TransBtn>
        <TransBtn
          color="royalblue"
          onClick={() => themeColorChange("royalblue")}
        >
          로얄 블루
        </TransBtn>
      </ButtonContainer>
    </>
  );
};
export default ThemeSetting;
