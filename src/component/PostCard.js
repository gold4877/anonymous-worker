import styled from "styled-components";

function PostCard({ post }) {
  const authorLabel = post.companyName ? `[${post.companyName}]` : "[무소속]";

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

    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const h = date.getHours();
    const min = String(date.getMinutes()).padStart(2, "0");
    const ampm = h >= 12 ? "오후" : "오전";
    const h12 = String(h % 12 || 12).padStart(2, "0");
    return `${y}. ${m}. ${d}. ${ampm} ${h12}:${min}`;
  };

  return (
    <CardWrapper>
      <CardHeader>
        <AuthorInfo>
          <CompanyBadge>{authorLabel}</CompanyBadge>
          <Nickname>{post.nickname || post.userName}</Nickname>
        </AuthorInfo>
        <MoreButton title="더보기" onClick={(e) => e.stopPropagation()}>
          ⋮
        </MoreButton>
      </CardHeader>

      <CardTitle>{post.title}</CardTitle>

      <CardFooter>
        <Stats>
          <Stat>
            <Icon>💬</Icon>
            {post.commentCount ?? 0}
          </Stat>
          {/* 좋아요 — 표시만, 클릭 시 카드 전체 onClick(상세이동) 발동 */}
          <Stat>
            <Icon>🤍</Icon>
            {post.likeCount ?? 0}
          </Stat>
          <Stat>
            <Icon>👁️</Icon>
            {post.viewCount ?? 0}
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
  &:hover {
    color: #1a1a1a;
  }
`;

const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 12px;
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
