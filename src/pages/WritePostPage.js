import styled from "styled-components";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserStore";
import AxiosApi from "../api/AxiosApi";

const CATEGORIES = [
  { value: "FREE", label: "자유게시판" },
  { value: "QNA", label: "질문 / 답변" },
  { value: "INFO", label: "정보게시판" },
];

const WritePostPage = () => {
  const navigate = useNavigate();
  const { loginUser } = useContext(UserContext);

  const [category, setCategory] = useState("FREE");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onClickSubmit = async () => {
    // 유효성 검사
    if (!title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }
    if (!content.trim()) {
      setError("내용을 입력해주세요.");
      return;
    }
    if (!loginUser) {
      setError("로그인이 필요합니다.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const rsp = await AxiosApi.writePost(
        loginUser.userId,
        title,
        content,
        category,
      );

      if (rsp.data.success) {
        navigate("/home");
      } else {
        setError(rsp.data.message || "등록에 실패했습니다.");
      }
    } catch (e) {
      console.error(e);
      setError("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      {/* ── 상단 타이틀 바 ── */}
      <TitleBar>
        <span style={{ fontSize: "20px" }}>✏️</span>
        <TitleText>글쓰기</TitleText>
      </TitleBar>

      {/* ── 바디 ── */}
      <Body>
        {/* 카테고리 카드 */}
        <Card>
          <CatHeader>
            <CatLabel>카테고리</CatLabel>
            <CatRequired>필수</CatRequired>
          </CatHeader>
          <CatBtns>
            {CATEGORIES.map((cat) => (
              <CatBtn
                key={cat.value}
                active={category === cat.value}
                onClick={() => setCategory(cat.value)}
              >
                {cat.label}
              </CatBtn>
            ))}
          </CatBtns>
        </Card>

        {/* 제목 + 내용 카드 */}
        <InputCard>
          <TitleInput
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError("");
            }}
            maxLength={100}
          />
          <Divider />
          <ContentInput
            placeholder="내용을 자유롭게 작성해 주세요"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setError("");
            }}
          />
        </InputCard>

        {/* 에러 메시지 */}
        {error && <ErrorText>{error}</ErrorText>}
      </Body>

      {/* ── 하단 버튼 바 ── */}
      <BottomBar>
        <CancelBtn onClick={() => navigate(-1)}>취소</CancelBtn>
        <SubmitBtn onClick={onClickSubmit} disabled={loading}>
          {loading ? "등록 중..." : "등록하기"}
        </SubmitBtn>
      </BottomBar>
    </PageWrapper>
  );
};

export default WritePostPage;

// ─── 스타일 ──────────────────────────────────────────────────
const PageWrapper = styled.div`
  background: #f2f2f2;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const TitleBar = styled.div`
  background: #ffffff;
  border-bottom: 1px solid #e1e1e1;
  height: 56px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TitleText = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
`;

const Body = styled.div`
  flex: 1;
  max-width: 720px;
  width: 100%;
  margin: 32px auto;
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Card = styled.div`
  background: #ffffff;
  border: 1px solid #e1e1e1;
  border-radius: 12px;
  padding: 20px;
`;

const CatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
`;

const CatLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
`;

const CatRequired = styled.span`
  font-size: 12px;
  color: #999999;
`;

const CatBtns = styled.div`
  display: flex;
  gap: 8px;
`;

const CatBtn = styled.button`
  padding: 8px 18px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  background: ${(p) => (p.active ? "#1a1a1a" : "#ffffff")};
  color: ${(p) => (p.active ? "#ffffff" : "#1a1a1a")};
  border: 1px solid ${(p) => (p.active ? "#1a1a1a" : "#e1e1e1")};
  &:hover {
    background: ${(p) => (p.active ? "#333333" : "#f5f5f5")};
  }
`;

const InputCard = styled.div`
  background: #ffffff;
  border: 1px solid #e1e1e1;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const TitleInput = styled.input`
  border: none;
  outline: none;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  background: #e8e8e8;
  border-radius: 8px;
  padding: 14px 16px;
  width: 100%;
  &::placeholder {
    color: #aaaaaa;
    font-weight: 400;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #eeeeee;
  margin: 12px 0;
`;

const ContentInput = styled.textarea`
  border: none;
  outline: none;
  font-size: 14px;
  color: #1a1a1a;
  background: #e8e8e8;
  border-radius: 8px;
  padding: 14px 16px;
  width: 100%;
  min-height: 320px;
  resize: none;
  line-height: 1.7;
  &::placeholder {
    color: #aaaaaa;
  }
`;

const ErrorText = styled.p`
  font-size: 13px;
  color: #e53e3e;
  text-align: center;
  margin: 0;
`;

const BottomBar = styled.div`
  background: #ffffff;
  border-top: 1px solid #e1e1e1;
  padding: 14px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  position: sticky;
  bottom: 0;
`;

const CancelBtn = styled.button`
  padding: 10px 24px;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  background: #ffffff;
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
  cursor: pointer;
  &:hover {
    background: #f5f5f5;
  }
`;

const SubmitBtn = styled.button`
  padding: 10px 28px;
  border: none;
  border-radius: 8px;
  background: #1d6bf3;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  cursor: pointer;
  &:hover {
    background: #1558d0;
  }
  &:disabled {
    background: #aaaaaa;
    cursor: not-allowed;
  }
`;
