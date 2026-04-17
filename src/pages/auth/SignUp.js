import { useState, useEffect, useContext } from "react";

import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import AxiosApi from "../../api/AxiosApi";
import { UserContext } from "../../context/UserStore";

// ===== 애니메이션 =====
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ===== 스타일 =====
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 400px;
  margin: 0 auto;
  padding: 28px 24px;
  animation: ${fadeIn} 0.25s ease;
`;

const StepIndicator = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 4px;
  justify-content: center;
  align-items: center;

  div {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #e1e1e1;
    transition: all 0.3s ease;
  }

  div.active {
    background-color: #1d6bf3;
    width: 24px;
    border-radius: 4px;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  box-sizing: border-box;
`;

const Input = styled.input`
  padding: 14px 44px 14px 16px;
  border-radius: 8px;
  border: 1.5px solid #e1e1e1;
  background-color: #f9f9f9;
  font-size: 15px;
  height: 52px;
  width: 100%;
  box-sizing: border-box;
  transition:
    border-color 0.2s,
    background-color 0.2s,
    box-shadow 0.2s;
  color: #1a1a1a;

  &::placeholder {
    color: #aaaaaa;
    font-size: 14px;
  }
  &:focus {
    outline: none;
    border-color: #1d6bf3;
    background-color: #ffffff;
    box-shadow: 0 0 0 3px rgba(29, 107, 243, 0.1);
  }
  &:disabled {
    background-color: #f0f0f0;
    cursor: not-allowed;
    color: #999;
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
  color: #aaaaaa;
  transition: color 0.2s;
  border-radius: 4px;

  &:hover {
    color: #1d6bf3;
  }
  &:focus {
    outline: 2px solid rgba(29, 107, 243, 0.3);
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
  padding: 14px;
  background-color: #1d6bf3;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.2px;
  transition:
    background-color 0.2s,
    transform 0.1s;

  &:hover:not(:disabled) {
    background-color: #155ab5;
  }
  &:active:not(:disabled) {
    transform: scale(0.98);
  }
  &:disabled {
    background-color: #c0cfe8;
    cursor: not-allowed;
  }
`;

const SubButton = styled.button`
  padding: 14px;
  background-color: #ffffff;
  color: #555555;
  border: 1.5px solid #e1e1e1;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background-color: #f5f5f5;
    border-color: #1d6bf3;
    color: #1d6bf3;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const GhostButton = styled.button`
  padding: 14px;
  background-color: transparent;
  color: #9ca3af;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s;

  &:hover {
    color: #555;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: ${(props) => (props.row ? "row" : "column")};
  button {
    flex: 1;
  }
`;

const ErrorText = styled.p`
  color: #dc2626;
  font-size: 13px;
  text-align: center;
  margin: 0;
  padding: 10px 12px;
  background-color: #fef2f2;
  border-radius: 6px;
  border: 1px solid #fecaca;
`;

const SuccessText = styled.p`
  color: #16a34a;
  font-size: 13px;
  text-align: center;
  margin: 0;
  padding: 10px 12px;
  background-color: #f0fdf4;
  border-radius: 6px;
  border: 1px solid #bbf7d0;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 10px;
  border: 1.5px solid #eeeeee;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 14px;
  user-select: none;
  color: #333;
  transition: color 0.2s;

  &:hover {
    color: #1d6bf3;
  }
  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: #1d6bf3;
    flex-shrink: 0;
  }
  &.all {
    font-weight: 600;
    color: #1a1a1a;
    padding-bottom: 10px;
    border-bottom: 1px solid #e5e5e5;
  }
  .badge {
    margin-left: auto;
    font-size: 11px;
    font-weight: 600;
    padding: 2px 7px;
    border-radius: 4px;
    flex-shrink: 0;
  }
  &.required .badge {
    background-color: #fee2e2;
    color: #dc2626;
  }
  &.optional .badge {
    background-color: #f3f4f6;
    color: #9ca3af;
  }
`;

const StrengthBarWrap = styled.div`
  margin-top: 10px;
`;

const StrengthBar = styled.div`
  height: 5px;
  border-radius: 99px;
  background-color: #eeeeee;
  overflow: hidden;
`;

const StrengthFill = styled.div`
  height: 100%;
  width: ${(props) => props.width};
  background-color: ${(props) => props.color};
  border-radius: 99px;
  transition:
    width 0.4s ease,
    background-color 0.4s ease;
`;

const StrengthRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
`;

const StrengthText = styled.span`
  font-size: 12px;
  color: ${(props) => props.color};
  font-weight: 600;
`;

const StrengthHint = styled.span`
  font-size: 11px;
  color: #aaaaaa;
`;

const ValidationText = styled.p`
  font-size: 12px;
  margin: 6px 0 0 2px;
  color: ${(props) => (props.valid ? "#16a34a" : "#dc2626")};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 20px;
  color: #1a1a1a;
  margin: 0;
  font-weight: 700;
  letter-spacing: -0.3px;
`;

const Subtitle = styled.p`
  text-align: center;
  font-size: 13px;
  color: #888888;
  margin: 0;
`;

const FieldBlock = styled.div`
  width: 100%;
`;

const FieldLabel = styled.p`
  font-size: 12px;
  color: #888888;
  margin: 0 0 6px 2px;

  span {
    font-size: 11px;
    color: #9ca3af;
    margin-left: 4px;
  }
`;

const InfoBox = styled.div`
  padding: 14px 16px;
  background-color: #eff6ff;
  border: 1.5px solid #bfdbfe;
  border-radius: 10px;
  font-size: 13px;
  color: #1e40af;
  line-height: 1.6;

  strong {
    display: block;
    font-size: 14px;
    margin-bottom: 4px;
    color: #1d4ed8;
  }
`;

// ===== 정규식 =====
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

// ===== 비밀번호 강도 =====
const getPasswordStrength = (pw) => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Za-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1)
    return {
      text: "약함",
      color: "#dc2626",
      width: "25%",
      hint: "문자+숫자+특수문자를 조합하세요",
    };
  if (score <= 2)
    return {
      text: "보통",
      color: "#f59e0b",
      width: "55%",
      hint: "더 강한 비밀번호를 권장해요",
    };
  if (score === 3)
    return { text: "강함", color: "#16a34a", width: "80%", hint: "좋아요!" };
  return {
    text: "매우 강함",
    color: "#0ea5e9",
    width: "100%",
    hint: "완벽해요!",
  };
};

// ===== 컴포넌트 =====
const SignUp = ({ switchToLogin, onClose, startStep, passedUserId }) => {
  const navigate = useNavigate();
  const { user, handleLogin } = useContext(UserContext);

  const [step, setStep] = useState(startStep || 1);

  // Step 1~3 상태
  const [email, setEmail] = useState("");
  const [nick, setNick] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [showPw, setShowPw] = useState(false); // 👁️
  const [showPw2, setShowPw2] = useState(false); // 👁️
  const [error, setError] = useState("");
  const [emailMsg, setEmailMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailValid, setEmailValid] = useState(null);
  const [agree, setAgree] = useState({
    all: false,
    terms: false,
    privacy: false,
    age: false,
    marketing: false,
  });

  // Step 4 상태 (회사 인증)
  const [userId, setUserId] = useState(passedUserId || user?.userId || null);
  const [realName, setRealName] = useState("");
  const [age, setAge] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [certLoading, setCertLoading] = useState(false);

  const passwordStrength = getPasswordStrength(pw);

  // ===== 이메일 중복 체크 =====
  useEffect(() => {
    if (passedUserId) setUserId(passedUserId);
    else if (user?.userId) setUserId(user.userId);

    if (!emailRegex.test(email)) {
      setEmailMsg("");
      setEmailValid(null);
      return;
    }

    const checkEmail = async () => {
      try {
        setEmailLoading(true);
        const rsp = await AxiosApi.checkEmail(email);
        if (rsp.data.data === true) {
          setEmailMsg("✓ 사용 가능한 이메일입니다.");
          setEmailValid(true);
        } else {
          setEmailMsg("✗ 이미 가입된 이메일입니다.");
          setEmailValid(false);
        }
      } catch (e) {
        setEmailMsg("✗ 이메일 확인 실패");
        setEmailValid(false);
      } finally {
        setEmailLoading(false);
      }
    };

    const timer = setTimeout(checkEmail, 500);
    return () => clearTimeout(timer);
  }, [email, passedUserId, user]);

  // ===== 약관 동의 =====
  const handleAll = (checked) => {
    setAgree({
      all: checked,
      terms: checked,
      privacy: checked,
      age: checked,
      marketing: checked,
    });
  };

  const handleSingle = (name, checked) => {
    const newState = { ...agree, [name]: checked };
    newState.all =
      newState.terms && newState.privacy && newState.age && newState.marketing;
    setAgree(newState);
  };

  const isStep1Valid = agree.terms && agree.privacy && agree.age;

  // ===== Step 2 → Step 3 =====
  const handleNext = () => {
    if (emailValid !== true) {
      setError("올바른 이메일을 입력해주세요.");
      return;
    }
    setError("");
    setStep(3);
  };

  // ===== Step 3 회원가입 → 자동 로그인 → Step 4 =====
  const handleSubmit = async () => {
    if (!nick || !pw || !pw2) {
      setError("닉네임과 비밀번호를 입력해주세요.");
      return;
    }
    if (!passwordRegex.test(pw)) {
      setError("비밀번호는 8자 이상, 문자+숫자 포함이어야 합니다.");
      return;
    }
    if (pw !== pw2) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // 1) 회원가입
      const signUpRsp = await AxiosApi.SignUp(email, pw, nick);
      if (!signUpRsp.data.success) {
        setError(signUpRsp.data.message || "회원가입에 실패했습니다.");
        return;
      }

      // 2) 자동 로그인
      const loginRsp = await AxiosApi.login(email, pw);
      if (!loginRsp.data.success) {
        setError("로그인에 실패했습니다. 직접 로그인해 주세요.");
        switchToLogin();
        return;
      }

      const acquiredUserId = loginRsp.data.userId ?? loginRsp.data.data?.userId;
      setUserId(acquiredUserId);

      if (typeof handleLogin === "function") {
        await handleLogin(loginRsp.data.data);
      }

      // 3) Step 4로 이동
      setStep(4);
    } catch (e) {
      setError(e.response?.data?.message || "처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // ===== Step 4 인증 신청 =====
  const handleApplyCertification = async () => {
    if (!userId) {
      setError("사용자 정보가 없습니다. 다시 로그인해주세요.");
      return;
    }
    if (!realName || !age || !companyName) {
      setError("실명, 나이, 회사명을 모두 입력해주세요.");
      return;
    }
    if (isNaN(age) || Number(age) < 1 || Number(age) > 120) {
      setError("올바른 나이를 입력해주세요.");
      return;
    }

    try {
      setCertLoading(true);
      setError("");
      await AxiosApi.applyCertification(
        userId,
        realName,
        Number(age),
        companyName,
      );
      alert("인증 신청이 완료됐습니다. 관리자 승인 후 이용 가능합니다");
      if (typeof onClose === "function") onClose();
      navigate("/home");
    } catch (e) {
      setError(
        e.response?.data?.message || "인증 신청 중 오류가 발생했습니다.",
      );
    } finally {
      setCertLoading(false);
    }
  };

  return (
    <Container>
      {/* ── STEP 1: 약관 동의 ── */}
      {step === 1 && (
        <>
          <StepIndicator>
            <div className="active" />
            <div />
            <div />
            <div />
          </StepIndicator>

          <Title>약관 동의</Title>
          <Subtitle>서비스 이용약관에 동의해주세요</Subtitle>

          <CheckboxWrapper>
            <CheckboxLabel className="all">
              <input
                type="checkbox"
                checked={agree.all}
                onChange={(e) => handleAll(e.target.checked)}
              />
              전체 동의
            </CheckboxLabel>
            <CheckboxLabel className="required">
              <input
                type="checkbox"
                checked={agree.terms}
                onChange={(e) => handleSingle("terms", e.target.checked)}
              />
              서비스 이용약관 동의
              <span className="badge">필수</span>
            </CheckboxLabel>
            <CheckboxLabel className="required">
              <input
                type="checkbox"
                checked={agree.privacy}
                onChange={(e) => handleSingle("privacy", e.target.checked)}
              />
              개인정보 수집 및 이용 동의
              <span className="badge">필수</span>
            </CheckboxLabel>
            <CheckboxLabel className="required">
              <input
                type="checkbox"
                checked={agree.age}
                onChange={(e) => handleSingle("age", e.target.checked)}
              />
              만 14세 이상입니다
              <span className="badge">필수</span>
            </CheckboxLabel>
            <CheckboxLabel className="optional">
              <input
                type="checkbox"
                checked={agree.marketing}
                onChange={(e) => handleSingle("marketing", e.target.checked)}
              />
              마케팅 정보 수신 동의
              <span className="badge">선택</span>
            </CheckboxLabel>
          </CheckboxWrapper>

          <Button
            disabled={!isStep1Valid}
            onClick={() => {
              setError("");
              setStep(2);
            }}
          >
            다음
          </Button>
        </>
      )}

      {/* ── STEP 2: 이메일 ── */}
      {step === 2 && (
        <>
          <StepIndicator>
            <div />
            <div className="active" />
            <div />
            <div />
          </StepIndicator>

          <Title>이메일 입력</Title>
          <Subtitle>사용할 이메일을 입력해주세요</Subtitle>

          <PlainInput
            placeholder="company@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailValid(null);
              setEmailMsg("");
            }}
            disabled={emailLoading}
          />

          {emailMsg &&
            (emailValid ? (
              <SuccessText>{emailMsg}</SuccessText>
            ) : (
              <ErrorText>{emailMsg}</ErrorText>
            ))}
          {error && <ErrorText>{error}</ErrorText>}

          <ButtonGroup row>
            <SubButton
              onClick={() => {
                setError("");
                setStep(1);
              }}
            >
              이전
            </SubButton>
            <Button
              onClick={handleNext}
              disabled={emailValid !== true || emailLoading}
            >
              {emailLoading ? "확인 중..." : "다음"}
            </Button>
          </ButtonGroup>
        </>
      )}

      {/* ── STEP 3: 닉네임 + 비밀번호 ── */}
      {step === 3 && (
        <>
          <StepIndicator>
            <div />
            <div />
            <div className="active" />
            <div />
          </StepIndicator>

          <Title>정보 입력</Title>
          <Subtitle>닉네임과 비밀번호를 설정해 주세요</Subtitle>

          {/* 닉네임 */}
          <FieldBlock>
            <FieldLabel>
              닉네임 <span>필수</span>
            </FieldLabel>
            <PlainInput
              placeholder="사용할 닉네임을 입력해주세요"
              value={nick}
              onChange={(e) => setNick(e.target.value)}
              disabled={loading}
            />
          </FieldBlock>

          {/* 비밀번호 */}
          <FieldBlock>
            <FieldLabel>
              비밀번호 <span>필수</span>
            </FieldLabel>
            <InputWrapper>
              <Input
                type={showPw ? "text" : "password"}
                placeholder="8자 이상, 문자+숫자 포함"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
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
            {pw && (
              <StrengthBarWrap>
                <StrengthBar>
                  <StrengthFill
                    width={passwordStrength.width}
                    color={passwordStrength.color}
                  />
                </StrengthBar>
                <StrengthRow>
                  <StrengthText color={passwordStrength.color}>
                    {passwordStrength.text}
                  </StrengthText>
                  <StrengthHint>{passwordStrength.hint}</StrengthHint>
                </StrengthRow>
              </StrengthBarWrap>
            )}
          </FieldBlock>

          {/* 비밀번호 확인 */}
          <FieldBlock>
            <FieldLabel>
              비밀번호 확인 <span>필수</span>
            </FieldLabel>
            <InputWrapper>
              <Input
                type={showPw2 ? "text" : "password"}
                placeholder="비밀번호를 다시 입력해주세요"
                value={pw2}
                onChange={(e) => setPw2(e.target.value)}
                disabled={loading}
              />
              <EyeButton
                type="button"
                onClick={() => setShowPw2((v) => !v)}
                tabIndex={-1}
                aria-label={showPw2 ? "비밀번호 숨기기" : "비밀번호 보기"}
              >
                <EyeIcon open={showPw2} />
              </EyeButton>
            </InputWrapper>
            {pw2 && (
              <ValidationText valid={pw === pw2}>
                {pw === pw2
                  ? "✓ 비밀번호가 일치합니다."
                  : "✗ 비밀번호가 다릅니다."}
              </ValidationText>
            )}
          </FieldBlock>

          {error && <ErrorText>{error}</ErrorText>}

          <ButtonGroup row>
            <SubButton
              onClick={() => {
                setError("");
                setStep(2);
              }}
              disabled={loading}
            >
              이전
            </SubButton>
            <Button
              onClick={handleSubmit}
              disabled={!nick || !pw || !pw2 || pw !== pw2 || loading}
            >
              {loading ? "처리 중..." : "가입 완료"}
            </Button>
          </ButtonGroup>
        </>
      )}

      {/* ── STEP 4: 회사 인증 신청 (선택) ── */}
      {step === 4 && (
        <>
          <StepIndicator>
            <div />
            <div />
            <div />
            <div className="active" />
          </StepIndicator>

          <Title>회사 인증 신청</Title>
          <Subtitle>인증 시 더 많은 기능을 이용할 수 있어요</Subtitle>

          <InfoBox>
            <strong>🎉 가입을 축하해요!</strong>
            회사 인증은 선택 사항이에요.
          </InfoBox>

          {/* 실명 */}
          <FieldBlock>
            <FieldLabel>
              실명 <span>필수</span>
            </FieldLabel>
            <PlainInput
              placeholder="홍길동"
              value={realName}
              onChange={(e) => setRealName(e.target.value)}
              disabled={certLoading}
            />
          </FieldBlock>

          {/* 나이 */}
          <FieldBlock>
            <FieldLabel>
              나이 <span>필수</span>
            </FieldLabel>
            <PlainInput
              type="number"
              placeholder="예) 28"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              disabled={certLoading}
              min={1}
              max={120}
            />
          </FieldBlock>

          {/* 회사명 */}
          <FieldBlock>
            <FieldLabel>
              회사명 / 소속 <span>필수</span>
            </FieldLabel>
            <PlainInput
              placeholder="예) 카카오, 네이버, 스타트업 등"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              disabled={certLoading}
            />
          </FieldBlock>

          {error && <ErrorText>{error}</ErrorText>}

          <Button
            onClick={handleApplyCertification}
            disabled={!realName || !age || !companyName || certLoading}
          >
            {certLoading ? "신청 중..." : "인증 신청하기"}
          </Button>

          <GhostButton
            onClick={() => {
              onClose && onClose();
              navigate("/home");
            }}
          >
            다음에 할게요
          </GhostButton>
        </>
      )}
    </Container>
  );
};

export default SignUp;
