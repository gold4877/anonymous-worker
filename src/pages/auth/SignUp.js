import { useState, useEffect } from "react";
import styled from "styled-components";
import AxiosApi from "../../api/AxiosApi";

// ===== 스타일 =====
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 400px;
  margin: 0 auto;
  padding: 24px;
`;

const StepIndicator = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  justify-content: center;

  div {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${(props) => props.color || "#e1e1e1"};
    transition: 0.3s;
  }

  div.active {
    background-color: #1d6bf3;
    width: 24px;
    border-radius: 4px;
  }
`;

const Input = styled.input`
  padding: 16px;
  border-radius: 6px;
  border: 1px solid #e1e1e1;
  background-color: #f9f9f9;
  font-size: 16px;
  min-height: 48px;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #1d6bf3;
    background-color: #ffffff;
  }

  &:disabled {
    background-color: #f0f0f0;
    cursor: not-allowed;
  }
`;

const Button = styled.button`
  padding: 12px;
  background-color: #1d6bf3;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.3s;

  &:hover:not(:disabled) {
    background-color: #155ab5;
  }

  &:disabled {
    background-color: #999999;
    cursor: not-allowed;
  }
`;

const SubButton = styled.button`
  padding: 12px;
  background-color: #ffffff;
  color: #1a1a1a;
  border: 1px solid #e1e1e1;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;

  &:hover {
    background-color: #f5f5f5;
    border-color: #1d6bf3;
    color: #1d6bf3;
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
  color: #e53e3e;
  font-size: 13px;
  text-align: center;
  margin: 0;
  padding: 8px;
  background-color: #ffe5e5;
  border-radius: 4px;
`;

const SuccessText = styled.p`
  color: #22c55e;
  font-size: 13px;
  text-align: center;
  margin: 0;
  padding: 8px;
  background-color: #e8f5e9;
  border-radius: 4px;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 8px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  user-select: none;

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: #1d6bf3;
  }

  &.all {
    font-weight: 600;
    padding-bottom: 8px;
    border-bottom: 1px solid #e1e1e1;
    margin-bottom: 4px;
  }

  &.required {
    color: #1a1a1a;

    &::after {
      content: "[필수]";
      color: #e53e3e;
      font-weight: 600;
      margin-left: auto;
    }
  }

  &.optional {
    color: #666666;

    &::after {
      content: "[선택]";
      color: #999999;
      margin-left: auto;
      font-size: 12px;
    }
  }
`;

// ===== 비밀번호 강도 =====
const StrengthBarWrap = styled.div`
  margin-top: 8px;
`;

const StrengthBar = styled.div`
  height: 6px;
  border-radius: 4px;
  background-color: #e1e1e1;
  overflow: hidden;
`;

const StrengthFill = styled.div`
  height: 100%;
  width: ${(props) => props.width};
  background-color: ${(props) => props.color};
  transition: 0.3s;
`;

const StrengthText = styled.p`
  font-size: 12px;
  margin-top: 6px;
  color: ${(props) => props.color};
  font-weight: 500;
`;

const ValidationText = styled.p`
  font-size: 12px;
  margin: 4px 0 0 0;
  color: ${(props) => (props.valid ? "#22c55e" : "#e53e3e")};
`;

const Title = styled.h2`
  text-align: center;
  font-size: 20px;
  color: #1a1a1a;
  margin: 0;
`;

const Subtitle = styled.p`
  text-align: center;
  font-size: 13px;
  color: #666666;
  margin: 0;
`;

// ===== 정규식 =====
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

const SignUp = ({ switchToLogin }) => {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [nick, setNick] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");

  const [error, setError] = useState("");
  const [emailMsg, setEmailMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  // ✅ null / true / false
  const [emailValid, setEmailValid] = useState(null);

  const [agree, setAgree] = useState({
    all: false,
    terms: false,
    privacy: false,
    age: false,
    marketing: false,
  });

  // ===== 비밀번호 강도 계산 =====
  const getPasswordStrength = (pw) => {
    let score = 0;

    if (pw.length >= 8) score++;
    if (/[A-Za-z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    if (score <= 1) {
      return { text: "약함", color: "#E53E3E", width: "33%" };
    } else if (score <= 3) {
      return { text: "보통", color: "#F59E0B", width: "66%" };
    } else {
      return { text: "강함", color: "#22C55E", width: "100%" };
    }
  };

  // 비밀번호 강도 (중복 호출 방지)
  const passwordStrength = getPasswordStrength(pw);

  // ===== 이메일 중복 체크 =====
  useEffect(() => {
    if (!emailRegex.test(email)) {
      setEmailMsg("");
      setEmailValid(null);
      return;
    }

    const checkEmail = async () => {
      try {
        setEmailLoading(true);
        // ❌ 여기서 setEmailValid(null) 하면 타이밍이 늦음 → 제거

        const rsp = await AxiosApi.checkEmail(email);

        // rsp.data = { success: true, message: '...', data: true/false }
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
  }, [email]);

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
    // 전체 동의는 모든 항목이 체크되었을 때만 true
    newState.all =
      newState.terms && newState.privacy && newState.age && newState.marketing;
    setAgree(newState);
  };

  const isStep1Valid = agree.terms && agree.privacy && agree.age;

  // ===== STEP 이동 =====
  const handleNext = () => {
    if (emailValid !== true) {
      setError("올바른 이메일을 입력해주세요.");
      return;
    }
    setError("");
    setStep(3);
  };

  // ===== 회원가입 =====
  const handleSubmit = async () => {
    if (!nick || !pw || !pw2) {
      setError("모든 값을 입력해주세요.");
      return;
    }

    if (!passwordRegex.test(pw)) {
      setError("비밀번호는 8자 이상, 문자+숫자 포함");
      return;
    }

    if (pw !== pw2) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      setLoading(true);
      const rsp = await AxiosApi.SignUp(email, pw, nick);

      if (rsp.data.success) {
        alert("회원가입 완료!");
        switchToLogin();
      } else {
        setError(rsp.data.message || "회원가입 실패");
      }
    } catch (e) {
      setError(
        e.response?.data?.message || "회원가입 처리 중 오류가 발생했습니다.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      {/* STEP 1 */}
      {step === 1 && (
        <>
          <StepIndicator>
            <div className="active" />
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
              이용약관
            </CheckboxLabel>

            <CheckboxLabel className="required">
              <input
                type="checkbox"
                checked={agree.privacy}
                onChange={(e) => handleSingle("privacy", e.target.checked)}
              />
              개인정보 처리방침
            </CheckboxLabel>

            <CheckboxLabel className="required">
              <input
                type="checkbox"
                checked={agree.age}
                onChange={(e) => handleSingle("age", e.target.checked)}
              />
              만 14세 이상
            </CheckboxLabel>

            <CheckboxLabel className="optional">
              <input
                type="checkbox"
                checked={agree.marketing}
                onChange={(e) => handleSingle("marketing", e.target.checked)}
              />
              마케팅 수신 동의
            </CheckboxLabel>
          </CheckboxWrapper>

          {error && <ErrorText>{error}</ErrorText>}

          <Button disabled={!isStep1Valid} onClick={() => setStep(2)}>
            다음
          </Button>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <StepIndicator>
            <div />
            <div className="active" />
            <div />
          </StepIndicator>

          <Title>이메일 인증</Title>
          <Subtitle>사용할 이메일을 입력해주세요</Subtitle>

          <Input
            placeholder="이메일 주소"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailValid(null); // 타이핑 즉시 초기화
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
            <SubButton onClick={() => setStep(1)}>이전</SubButton>
            <Button
              onClick={handleNext}
              disabled={emailValid !== true || emailLoading}
            >
              다음
            </Button>
          </ButtonGroup>
        </>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <>
          <StepIndicator>
            <div />
            <div />
            <div className="active" />
          </StepIndicator>

          <Title>비밀번호 설정</Title>
          <Subtitle>계정 정보를 입력해주세요</Subtitle>

          <div style={{ width: "100%" }}>
            <Input
              placeholder="닉네임"
              value={nick}
              onChange={(e) => setNick(e.target.value)}
              disabled={loading}
            />
          </div>

          <div style={{ width: "100%" }}>
            <Input
              type="password"
              placeholder="비밀번호 (8자 이상, 문자+숫자 포함)"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              disabled={loading}
            />

            {pw && (
              <StrengthBarWrap>
                <StrengthBar>
                  <StrengthFill
                    width={passwordStrength.width}
                    color={passwordStrength.color}
                  />
                </StrengthBar>
                <StrengthText color={passwordStrength.color}>
                  {passwordStrength.text}
                </StrengthText>
              </StrengthBarWrap>
            )}
          </div>

          <div style={{ width: "100%" }}>
            <Input
              type="password"
              placeholder="비밀번호 확인"
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
              disabled={loading}
            />

            {pw2 && (
              <ValidationText valid={pw === pw2}>
                {pw === pw2
                  ? "✓ 비밀번호가 일치합니다."
                  : "✗ 비밀번호가 다릅니다."}
              </ValidationText>
            )}
          </div>

          {error && <ErrorText>{error}</ErrorText>}

          <ButtonGroup row>
            <SubButton onClick={() => setStep(2)} disabled={loading}>
              이전
            </SubButton>
            <Button
              onClick={handleSubmit}
              disabled={!nick || !pw || !pw2 || pw !== pw2 || loading}
            >
              {loading ? "가입 중..." : "가입 완료"}
            </Button>
          </ButtonGroup>
        </>
      )}
    </Container>
  );
};

export default SignUp;
