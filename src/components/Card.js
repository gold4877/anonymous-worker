import styled from "styled-components";
import { useState } from "react";

// 모든 컴포넌트/페이지에서 사용할 통일된 Global CSS Reset
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap');
  
  /* 1단계: 기본 리셋 */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
  }
  
  *::before, *::after {
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
  }
  
  /* 2단계: HTML 기본값 */
  html {
    font-size: 16px;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
    -moz-text-size-adjust: 100%;
    text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    -webkit-font-feature-settings: "kern" 1;
    -moz-font-feature-settings: "kern" 1;
    font-feature-settings: "kern" 1;
    font-kerning: auto;
  }
  
  /* 3단계: BODY 기본값 */
  body {
    margin: 0;
    padding: 0;
    font-family: 'Pretendard', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    letter-spacing: -0.3px;
    color: #1a1a1a;
    background-color: transparent;
    -webkit-font-smoothing: antialiased;
    -webkit-text-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    -webkit-appearance: none;
  }
  
  /* 4단계: 텍스트 요소 */
  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    padding: 0;
    font-weight: inherit;
    font-size: inherit;
    line-height: 1.2;
    letter-spacing: inherit;
  }
  
  p, span, div, article, section, main {
    margin: 0;
    padding: 0;
    line-height: 1.5;
    letter-spacing: -0.3px;
  }
  
  /* 5단계: BUTTON 전체 리셋 */
  button {
    margin: 0;
    padding: 0;
    border: none;
    outline: none;
    background: none;
    color: inherit;
    font-family: 'Pretendard', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    font-size: 16px;
    font-weight: inherit;
    cursor: pointer;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }
  
  button:focus {
    outline: none;
  }
  
  /* 6단계: INPUT 전체 리셋 */
  input, textarea, select {
    margin: 0;
    padding: 0;
    border: none;
    outline: none;
    background: none;
    color: inherit;
    font-family: 'Pretendard', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    font-size: 16px;
    font-weight: inherit;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }
  
  input:focus, textarea:focus, select:focus {
    outline: none;
  }
  
  input::placeholder {
    color: inherit;
    opacity: 0.7;
  }
  
  /* 7단계: 링크 */
  a {
    color: inherit;
    text-decoration: none;
    background-color: transparent;
  }
  
  /* 8단계: 이미지 */
  img {
    max-width: 100%;
    height: auto;
    display: block;
    border: none;
  }
  
  /* 9단계: 리스트 */
  ul, ol, li {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  
  /* 10단계: 테이블 */
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  
  td, th {
    padding: 0;
    margin: 0;
  }
`;

const CardWrapper = styled.div`
  background: #ffffff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e1e1;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const CompanyBadge = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #1d6bf3;
  font-family: "Pretendard", sans-serif;
`;

const MoreButton = styled.button`
  background: none;
  border: none;
  color: #999999;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;

  &:hover {
    color: #1a1a1a;
  }
`;

const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 12px 0;
  padding: 0;
  line-height: 1.4;
  font-family: "Pretendard", sans-serif;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e1e1e1;
`;

const Stats = styled.div`
  display: flex;
  gap: 20px;
`;

const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #666;
  font-family: "Pretendard", sans-serif;
`;

const Icon = styled.span`
  font-size: 14px;
`;

const Time = styled.span`
  font-size: 12px;
  color: #999999;
  font-family: "Pretendard", sans-serif;
`;

function Card({ post }) {
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeToggle = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  // 작성자 표시 (회사명이 없으면 [무소속])
  const authorLabel = post.companyName ? `[${post.companyName}]` : "[무소속]";

  // 시간 포맷팅 (12시간 형식)
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "방금 전";
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;

    // 7일 이상: 날짜 + 시간 (12시간 형식)
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");

    const ampm = hours >= 12 ? "오후" : "오전";
    const hours12 = hours % 12 || 12;
    const hoursStr = String(hours12).padStart(2, "0");

    return `${year}. ${month}. ${day}. ${ampm} ${hoursStr}:${minutes}`;
  };

  return (
    <CardWrapper>
      <CardHeader>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <CompanyBadge>{authorLabel}</CompanyBadge>
          <div
            style={{
              fontSize: "13px",
              color: "#666",
              fontFamily: "'Pretendard', sans-serif",
            }}
          >
            {post.nickname}
          </div>
        </div>
        <MoreButton title="더보기">⋮</MoreButton>
      </CardHeader>

      <CardTitle>{post.title}</CardTitle>

      <CardFooter>
        <Stats>
          <Stat>
            <Icon>💬</Icon>
            {post.commentCount}
          </Stat>
          <Stat
            onClick={handleLikeToggle}
            style={{ cursor: "pointer" }}
            title="좋아요"
          >
            <Icon>{isLiked ? "❤️" : "🤍"}</Icon>
            {post.likeCount + (isLiked ? 1 : 0)}
          </Stat>
          <Stat>
            <Icon>👁️</Icon>
            {post.viewCount}
          </Stat>
        </Stats>
        <Time>{formatTime(post.createdAt)}</Time>
      </CardFooter>
    </CardWrapper>
  );
}

export default Card;
