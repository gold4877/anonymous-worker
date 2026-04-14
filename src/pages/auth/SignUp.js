import { useState } from "react";
import styled from "styled-components";
import AxiosApi from "../../api/AxiosApi";

// 스타일
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #e1e1e1;
  background-color: #eeeeee;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #1d6bf3;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:disabled {
    background-color: #999999;
    cursor: not-allowed;
  }
`;

const SubButton = styled.button`
  padding: 10px;
  background-color: #1a1a1a;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;

const ErrorText = styled.p`
  color: #e53e3e;
  font-size: 13px;
  text-align: center;
`;

const SignUp = ({ switchToLogin }) => {
  const [step, setStep] = useState(1);

  // 입력값
  const [email, setEmail] = useState("");
  const [nick, setNick] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [error, setError] = useState("");

  // 약관
  const [agree, setAgree] = useState({
    all: false,
    terms: false,
    privacy: false,
    age: false,
    marketing: false,
  });

  // 정규식
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  // 전체 동의
  const handleAll = (checked) => {
    setAgree({
      all: checked,
      terms: checked,
      privacy: checked,
      age: checked,
      marketing: checked,
    });
  };

  // 개별 동의
  const handleSingle = (name, checked) => {
    const newState = { ...agree, [name]: checked };
    newState.all =
      newState.terms && newState.privacy && newState.age && newState.marketing;
    setAgree(newState);
  };

  const isStep1Valid = agree.terms && agree.privacy && agree.age;

  // STEP 2 → 이메일 검증
  const handleNext = () => {
    if (!email) {
      setError("이메일을 입력해주세요.");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("올바른 이메일 형식이 아닙니다.");
      return;
    }

    //  회사 이메일 말고  개인  이메일로 가입 못하게 막는 코드 우리한텐 필요 없을듯?
    // const invalidDomains = ["gmail.com", "naver.com", "daum.net"];
    // const domain = email.split("@")[1];
    // if (!domain || invalidDomains.includes(domain)) {
    //   setError("회사 이메일을 입력해주세요.");
    //   return;
    // }

    setError("");
    setStep(3);
  };

  // STEP 3 → 최종 검증
  const handleSubmit = async () => {
    if (!nick || !pw || !pw2) {
      setError("모든 값을 입력해주세요.");
      return;
    }

    if (!passwordRegex.test(pw)) {
      setError("비밀번호는 8자 이상, 문자와 숫자를 포함해야 합니다.");
      return;
    }

    if (pw !== pw2) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const rsp = await AxiosApi.SignUp(email, pw, nick);

      if (rsp.data.success) {
        alert("회원가입 완료!");
        switchToLogin();
      } else {
        setError(rsp.data.message || "회원가입 실패");
      }
    } catch (error) {
      console.error(error);
      setError("서버 오류가 발생했습니다.");
    }
  };
  return (
    <Container>
      {/* STEP 1 */}
      {step === 1 && (
        <>
          <label>
            <input
              type="checkbox"
              checked={agree.all}
              onChange={(e) => handleAll(e.target.checked)}
            />
            전체 동의
          </label>

          <label>
            <input
              type="checkbox"
              checked={agree.terms}
              onChange={(e) => handleSingle("terms", e.target.checked)}
            />
            [필수] 서비스 이용약관
          </label>

          <label>
            <input
              type="checkbox"
              checked={agree.privacy}
              onChange={(e) => handleSingle("privacy", e.target.checked)}
            />
            [필수] 개인정보 수집 및 이용 동의
          </label>

          <label>
            <input
              type="checkbox"
              checked={agree.age}
              onChange={(e) => handleSingle("age", e.target.checked)}
            />
            [필수] 만 14세 이상입니다
          </label>

          <label>
            <input
              type="checkbox"
              checked={agree.marketing}
              onChange={(e) => handleSingle("marketing", e.target.checked)}
            />
            [선택] 마케팅 정보 수신 동의
          </label>

          <Button disabled={!isStep1Valid} onClick={() => setStep(2)}>
            다음
          </Button>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <Input
            placeholder="회사 이메일 (example@company.com)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && <ErrorText>{error}</ErrorText>}

          <SubButton onClick={() => setStep(1)}>이전</SubButton>
          <Button onClick={handleNext}>다음</Button>
        </>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <>
          <Input
            placeholder="닉네임"
            value={nick}
            onChange={(e) => setNick(e.target.value)}
          />

          <Input
            type="password"
            placeholder="비밀번호"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />

          <Input
            type="password"
            placeholder="비밀번호 확인"
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
          />

          {error && <ErrorText>{error}</ErrorText>}

          <SubButton onClick={() => setStep(2)}>이전</SubButton>
          <Button onClick={handleSubmit}>가입 완료</Button>
        </>
      )}
    </Container>
  );
};

export default SignUp;
