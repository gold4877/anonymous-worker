import styled from "styled-components";
import { useState } from "react";

function PostCard({ post }) {
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeToggle = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  // 작성자 표시
  const authorLabel = post.companyName ? `[${post.companyName}]` : "[무소속]";

  // 시간 포맷팅
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

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "오후" : "오전";
    const hours12 = String(hours % 12 || 12).padStart(2, "0");

    return `${year}. ${month}. ${day}. ${ampm} ${hours12}:${minutes}`;
  };

  return (
    <CardWrapper>
      <CardHeader>
        <AuthorInfo>
          <CompanyBadge>{authorLabel}</CompanyBadge>
          <Nickname>{post.nickname}</Nickname>
        </AuthorInfo>
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

export default PostCard;

// ─── 스타일 ──────────────────────────────────────────────────
const CardWrapper = styled.div`
  background: #ffffff;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e1e1e1;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const AuthorInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CompanyBadge = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #1d6bf3;
`;

const Nickname = styled.span`
  font-size: 13px;
  color: #666666;
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
  line-height: 1.4;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  color: #666666;
`;

const Icon = styled.span`
  font-size: 14px;
`;

const Time = styled.span`
  font-size: 12px;
  color: #999999;
`;
