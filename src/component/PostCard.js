import styled from "styled-components";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserStore";
import AxiosApi from "../api/AxiosApi";

function PostCard({ post }) {
  const { loginUser } = useContext(UserContext);
  const authorLabel = post.companyName ? `[${post.companyName}]` : "[무소속]";

  // ✨ [변경] 좋아요 상태를 관리하는 state 추가
  // liked: 현재 사용자가 이 게시글을 좋아요했는지 여부
  // likeCount: 현재 게시글의 좋아요 수
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount ?? 0);
  const [isLoading, setIsLoading] = useState(false);

  // ✨ [변경] 컴포넌트 마운트 시 좋아요 상태 확인
  // 설명:
  //   - 로그인한 사용자만 좋아요 상태 확인
  //   - isLiked API를 호출하여 현재 사용자의 좋아요 여부 확인
  useEffect(() => {
    if (loginUser && post.postId) {
      checkLikeStatus();
    }
  }, [loginUser, post.postId]);

  // ✨ [변경] 좋아요 상태 확인 함수
  const checkLikeStatus = async () => {
    try {
      const rsp = await AxiosApi.isLiked(post.postId, loginUser.userId);
      if (rsp.data.success) {
        setLiked(rsp.data.data);
      }
    } catch (e) {
      console.error("좋아요 상태 확인 실패:", e);
    }
  };

  // ✨ [변경] 좋아요 추가 함수 (취소는 불가능)
  // 설명:
  //   - 로그인하지 않으면 알림 표시
  //   - 이미 좋아요했으면 알림 표시
  //   - toggleLike API 호출 (좋아요 추가만 가능)
  //   - 서버에서 예외 발생 시 사용자 알림
  const handleLikeClick = async (e) => {
    e.stopPropagation();

    if (!loginUser) {
      alert("로그인 후 좋아요를 눌러주세요.");
      return;
    }

    // ✨ [변경] 이미 좋아요한 경우 알림
    // 설명:
    //   - liked 상태가 true이면 이미 좋아요한 것
    //   - 알림을 띄우고 함수 종료
    //   - 서버 요청을 하지 않음
    if (liked) {
      alert("이미 좋아요한 게시글입니다.");
      return;
    }

    setIsLoading(true);
    try {
      const rsp = await AxiosApi.toggleLike(post.postId, loginUser.userId);
      if (rsp.data.success) {
        // 서버에서 받은 최신 데이터로 업데이트
        setLiked(rsp.data.data.liked);
        setLikeCount(rsp.data.data.likeCount);
      }
    } catch (e) {
      // ✨ [변경] 서버에서 예외 발생 시 사용자 알림
      // 설명:
      //   - "이미 좋아요한 게시글입니다." 메시지 표시
      //   - 서버와 클라이언트 상태 동기화 필요 시 재확인
      if (e.response?.data?.message) {
        alert(e.response.data.message);
      } else {
        alert("좋아요 처리 중 오류가 발생했습니다.");
      }
      console.error("좋아요 추가 실패:", e);
    } finally {
      setIsLoading(false);
    }
  };

  // ✨ [변경] 시간 표시 형식을 변경했습니다
  // 설명:
  //   - 한국 시간대(Asia/Seoul) 기준으로 시간 계산
  //   - 오늘: "X시간 전" 또는 "X분 전" (기존 유지)
  //   - 어제: "어제 오전/오후 HH시 MM분" (새로 추가)
  //   - 2-6일 전: "X일 전 오전/오후 HH시 MM분" (새로 추가)
  //   - 7일 이상: "2026.04.16 오전 11시 34분" (형식 변경)
  const formatTime = (dateString) => {
    const date = new Date(dateString);

    // ✨ 한국 시간대로 변환
    const koreaDate = new Date(
      date.toLocaleString("en-US", { timeZone: "Asia/Seoul" }),
    );
    const koreaToday = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }),
    );

    // ✨ 날짜 차이 계산 (한국 시간 기준)
    const diffMs = koreaToday - koreaDate;
    const diffDays = Math.floor(diffMs / 86400000);

    // ✨ 시간/분 포매팅 함수
    const formatTimePart = (date) => {
      const h = date.getHours();
      const min = String(date.getMinutes()).padStart(2, "0");
      const ampm = h >= 12 ? "오후" : "오전";
      const h12 = h % 12 || 12;
      return `${ampm} ${h12}시 ${min}분`;
    };

    // ✨ 날짜 포매팅 함수
    const formatDatePart = (date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      return `${y}.${m}.${d}`;
    };

    // ✨ 분 단위 계산 (24시간 이내)
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    // ✨ 시간 표시 로직
    if (diffMinutes < 1) return "방금 전";
    if (diffMinutes < 60) return `${diffMinutes}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;

    // ✨ 어제 표시
    if (diffDays === 1) {
      return `어제 ${formatTimePart(koreaDate)}`;
    }

    // ✨ 2일 전부터 6일 전까지
    if (diffDays >= 2 && diffDays <= 6) {
      return `${diffDays}일 전 ${formatTimePart(koreaDate)}`;
    }

    // ✨ 7일 이상 전
    return `${formatDatePart(koreaDate)} ${formatTimePart(koreaDate)}`;
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
          {/* ✨ [변경] 게시글 목록에서 좋아요 기능 비활성화 (읽기 전용) */}
          {/* 변경 사항:
              - onClick 제거: 게시글 목록(메인 페이지)에서 클릭 불가능
              - cursor 'auto': 부모의 pointer 커서 상속
              - opacity 고정 1: 클릭 불가 상태 표시 제거 (항상 선명하게 표시)
              - 좋아요 상태는 표시만 함 (UI만 보여줌)
              - 상세 페이지(/post/{id})에서만 좋아요 기능이 작동함
              
              기존 주석 (현재 게시글 목록에서는 비활성):
              - liked 상태에 따라 하트 아이콘 변경 (🤍 → ❤️)
              - 로딩 중에는 opacity 변경 [게시글 목록에서는 불필요]
              - 서버 API(toggleLike)로 상태 저장 [상세페이지에서만 작동] */}
          <Stat
            style={{
              cursor: "auto",
              opacity: 1,
            }}
          >
            <Icon>{liked ? "❤️" : "🤍"}</Icon>
            {likeCount}
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
// ✨ [변경] CardWrapper에 cursor: pointer 추가
// 설명:
//   - 사용자가 게시물 영역에 호버할 때 커서가 포인터로 변경
//   - 클릭 가능한 요소임을 시각적으로 표시
//   - 전체 게시물 영역에서 포인터 커서 표시
const CardWrapper = styled.div`
  background: #ffffff;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e1e1e1;
  transition: box-shadow 0.2s;
  cursor: pointer;

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

// ✨ [변경] 아이콘 개별 호버 효과 제거
// 설명:
//   - 기존: &:hover { color: #1d6bf3; } 존재
//   - 변경: &:hover 제거 (호버 색상 변경 안 함)
//   - 결과: 댓글, 좋아요, 조회수 아이콘 개별 호버 비활성화
//   - 게시물 카드 전체 호버(CardWrapper의 box-shadow)는 유지됨
//   - 사용자가 게시물 카드 영역에 진입할 때만 그림자 효과 표시
const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #666666;
  transition: color 0.2s;
`;

const Icon = styled.span`
  font-size: 14px;
`;

const Time = styled.span`
  font-size: 12px;
  color: #999999;
`;
