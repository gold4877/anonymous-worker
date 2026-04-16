import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import AxiosApi from "../../api/AxiosApi";
import { UserContext } from "../../context/UserStore";

const SignUp = ({ switchToLogin, onClose }) => {
  const navigate = useNavigate();
  const { handleLogin } = useContext(UserContext);

  const [step, setStep] = useState(1);

  // Step 2~3 입력값
  const [email, setEmail] = useState("");
  const [nick, setNick] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [error, setError] = useState("");

  // Step 4 입력값
  const [realName, setRealName] = useState("");
  const [age, setAge] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [certError, setCertError] = useState("");
  const [certLoading, setCertLoading] = useState(false);

  // 가입 완료 후 자동 로그인해서 얻은 userId 저장
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  // 약관
  const [agree, setAgree] = useState({
    all: false,
    terms: false,
    privacy: false,
    age: false,
    marketing: false,
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  const isStep1Valid = agree.terms && agree.privacy && agree.age;

  const handleAll = (checked) =>
    setAgree({
      all: checked,
      terms: checked,
      privacy: checked,
      age: checked,
      marketing: checked,
    });

  const handleSingle = (name, checked) => {
    const next = { ...agree, [name]: checked };
    next.all = next.terms && next.privacy && next.age && next.marketing;
    setAgree(next);
  };

  // ── Step 2 → 3 ───────────────────────────────────────────────
  const handleNext = () => {
    if (!email) {
      setError("이메일을 입력해주세요.");
      return;
    }
    if (!emailRegex.test(email)) {
      setError("올바른 이메일 형식이 아닙니다.");
      return;
    }
    setError("");
    setStep(3);
  };

  // ── Step 3 → 회원가입 → 자동 로그인 → Step 4 ────────────────
  const handleSubmit = async () => {
    if (!nick || !pw || !pw2) {
      setError("모든 값을 입력해주세요.");
      return;
    }
    if (!passwordRegex.test(pw)) {
      setError("비밀번호는 8자 이상, 영문+숫자를 포함해야 합니다.");
      return;
    }
    if (pw !== pw2) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      // 1. 회원가입
      const signUpRsp = await AxiosApi.SignUp(email, pw, nick);
      if (!signUpRsp.data.success) {
        setError(signUpRsp.data.message || "회원가입 실패");
        return;
      }

      // 2. 자동 로그인 → userId 확보
      const loginRsp = await AxiosApi.login(email, pw);
      if (loginRsp.data.success) {
        const userData = loginRsp.data.data;
        handleLogin(userData); // UserContext에 로그인 상태 저장
        setLoggedInUserId(userData.userId);
        setStep(4); // Step 4로 이동
      }
    } catch (e) {
      console.error(e);
      setError("서버 오류가 발생했습니다.");
    }
  };

  // ── Step 4 인증 신청 ─────────────────────────────────────────
  const handleCertSubmit = async () => {
    if (!realName || !age || !companyName) {
      setCertError("모든 항목을 입력해주세요.");
      return;
    }
    if (isNaN(Number(age)) || Number(age) < 14) {
      setCertError("올바른 나이를 입력해주세요.");
      return;
    }

    setCertLoading(true);
    setCertError("");
    try {
      const rsp = await AxiosApi.applyCertification(
        loggedInUserId,
        realName,
        Number(age),
        companyName,
      );
      if (rsp.data.success) {
        alert("인증 신청이 완료됐습니다. 관리자 승인 후 이용 가능합니다.");
        onClose && onClose();
        navigate("/home");
      } else {
        setCertError(rsp.data.message || "인증 신청 실패");
      }
    } catch (e) {
      console.error(e);
      setCertError("서버 오류가 발생했습니다.");
    } finally {
      setCertLoading(false);
    }
  };

  // ── Step 4 다음에 할게요 ─────────────────────────────────────
  const handleSkip = () => {
    onClose && onClose();
    navigate("/home");
  };

  return (
    <Container>
      {/* ── Step 1: 약관 동의 ── */}
      {step === 1 && (
        <>
          <StepTitle>서비스 이용 약관</StepTitle>
          <CheckItem>
            <input
              type="checkbox"
              checked={agree.all}
              onChange={(e) => handleAll(e.target.checked)}
            />
            전체 동의
          </CheckItem>
          <Divider />
          <CheckItem>
            <input
              type="checkbox"
              checked={agree.terms}
              onChange={(e) => handleSingle("terms", e.target.checked)}
            />
            [필수] 서비스 이용약관
          </CheckItem>
          <CheckItem>
            <input
              type="checkbox"
              checked={agree.privacy}
              onChange={(e) => handleSingle("privacy", e.target.checked)}
            />
            [필수] 개인정보 수집 및 이용 동의
          </CheckItem>
          <CheckItem>
            <input
              type="checkbox"
              checked={agree.age}
              onChange={(e) => handleSingle("age", e.target.checked)}
            />
            [필수] 만 14세 이상입니다
          </CheckItem>
          <CheckItem>
            <input
              type="checkbox"
              checked={agree.marketing}
              onChange={(e) => handleSingle("marketing", e.target.checked)}
            />
            [선택] 마케팅 정보 수신 동의
          </CheckItem>
          <PrimaryBtn disabled={!isStep1Valid} onClick={() => setStep(2)}>
            다음
          </PrimaryBtn>
        </>
      )}

      {/* ── Step 2: 이메일 ── */}
      {step === 2 && (
        <>
          <StepTitle>이메일 입력</StepTitle>
          <StepDesc>회사 이메일을 입력해 주세요.</StepDesc>
          <Input
            placeholder="example@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && <ErrorText>{error}</ErrorText>}
          <BtnRow>
            <SubBtn
              onClick={() => {
                setStep(1);
                setError("");
              }}
            >
              이전
            </SubBtn>
            <PrimaryBtn onClick={handleNext}>다음</PrimaryBtn>
          </BtnRow>
        </>
      )}

      {/* ── Step 3: 닉네임 + 비밀번호 ── */}
      {step === 3 && (
        <>
          <StepTitle>정보 입력</StepTitle>
          <Label>닉네임</Label>
          <Input
            placeholder="2~10자, 한글·영문·숫자"
            value={nick}
            onChange={(e) => setNick(e.target.value)}
          />
          <Label>비밀번호</Label>
          <Input
            type="password"
            placeholder="8자 이상, 영문+숫자"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />
          <Label>비밀번호 확인</Label>
          <Input
            type="password"
            placeholder="비밀번호 재입력"
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
          />
          {error && <ErrorText>{error}</ErrorText>}
          <BtnRow>
            <SubBtn
              onClick={() => {
                setStep(2);
                setError("");
              }}
            >
              이전
            </SubBtn>
            <PrimaryBtn onClick={handleSubmit}>가입 완료</PrimaryBtn>
          </BtnRow>
        </>
      )}

      {/* ── Step 4: 회사 인증 신청 (선택) ── */}
      {step === 4 && (
        <>
          <StepTitle>회사 인증 신청</StepTitle>
          <StepDesc>
            인증 완료 시 회사명이 표시되고 글 작성이 가능해요.
            <br />
            <GrayText>관리자 승인까지 최대 1~2일 소요됩니다.</GrayText>
          </StepDesc>

          <Label>실명</Label>
          <Input
            placeholder="홍길동"
            value={realName}
            onChange={(e) => setRealName(e.target.value)}
          />
          <Label>나이</Label>
          <Input
            type="number"
            placeholder="30"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          <Label>회사명</Label>
          <Input
            placeholder="카카오"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />

          {certError && <ErrorText>{certError}</ErrorText>}

          <PrimaryBtn onClick={handleCertSubmit} disabled={certLoading}>
            {certLoading ? "신청 중..." : "인증 신청하기"}
          </PrimaryBtn>
          <SkipBtn onClick={handleSkip}>다음에 할게요</SkipBtn>
        </>
      )}
    </Container>
  );
};

export default SignUp;

// ─── 스타일 ──────────────────────────────────────────────────
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const StepTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
`;

const StepDesc = styled.p`
  font-size: 13px;
  color: #666666;
  margin: 0;
  line-height: 1.6;
`;

const GrayText = styled.span`
  font-size: 12px;
  color: #999999;
`;

const Label = styled.p`
  font-size: 13px;
  font-weight: 500;
  color: #1a1a1a;
  margin: 0;
`;

const Input = styled.input`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #e1e1e1;
  background-color: #eeeeee;
  font-size: 14px;
  outline: none;
  &:focus {
    border-color: #1d6bf3;
    background: #ffffff;
  }
`;

const PrimaryBtn = styled.button`
  padding: 12px;
  background-color: #1d6bf3;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  &:hover {
    background: #1558d0;
  }
  &:disabled {
    background-color: #aaaaaa;
    cursor: not-allowed;
  }
`;

const SubBtn = styled.button`
  padding: 12px 20px;
  background-color: #1a1a1a;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background: #333333;
  }
`;

const SkipBtn = styled.button`
  padding: 10px;
  background: none;
  border: none;
  color: #999999;
  font-size: 13px;
  cursor: pointer;
  text-decoration: underline;
  &:hover {
    color: #666666;
  }
`;

const BtnRow = styled.div`
  display: flex;
  gap: 8px;
`;

const CheckItem = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #1a1a1a;
  cursor: pointer;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e1e1e1;
  margin: 4px 0;
`;

const ErrorText = styled.p`
  color: #e53e3e;
  font-size: 13px;
  text-align: center;
  margin: 0;
`;
