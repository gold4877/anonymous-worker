import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useLocation } from "react-router-dom";

// 1. 색상 팔레트
const Colors = {
  Primary: "#1A1A1A",
  Accent: "#1D6BF3",
  BgCard: "#FFFFFF",
  BgMain: "#F5F5F5",
  BgInput: "#EEEEEE",
  Border: "#E1E1E1",
  TextMuted: "#999999",
  Error: "#E53E3E",
  Success: "#38A169",
  Warning: "#F6AD55",
};

// 2. Styled Components
const Container = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background-color: ${Colors.BgMain};
  font-family: "Pretendard", sans-serif;
`;

const Wrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const Header = styled.header`
  margin-bottom: 2rem;
  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${Colors.Primary};
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: -1px;
`;

const Tab = styled.div`
  padding: 12px 24px;
  cursor: pointer;
  background-color: ${(props) =>
    props.active ? Colors.BgCard : "transparent"};
  border: 1px solid ${(props) => (props.active ? Colors.Border : "transparent")};
  border-bottom: ${(props) =>
    props.active ? `2px solid ${Colors.BgCard}` : "none"};
  border-radius: 8px 8px 0 0;
  font-weight: ${(props) => (props.active ? "700" : "500")};
  color: ${(props) => (props.active ? Colors.Accent : Colors.TextMuted)};
  z-index: 1;
`;

const ContentCard = styled.div`
  background-color: ${Colors.BgCard};
  border: 1px solid ${Colors.Border};
  border-radius: 0 12px 12px 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
`;

const ActionToolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  /* 열 넓이 고정 핵심 속성 */
  table-layout: fixed;

  th {
    background-color: #fafafa;
    padding: 1rem;
    font-size: 0.85rem;
    color: ${Colors.TextMuted};
    border-bottom: 1px solid ${Colors.Border};
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  td {
    padding: 1.1rem 1rem;
    font-size: 0.85rem;
    border-bottom: 1px solid ${Colors.Border};
    vertical-align: middle;
    /* 텍스트가 길어지면 줄바꿈 대신 말줄임표 처리 */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const PinIcon = styled.span`
  cursor: pointer;
  margin-right: 12px;
  font-size: 1.2rem;
  color: ${(props) => (props.isPinned ? Colors.Warning : "#DDD")};
  transition: all 0.2s;
  &:hover {
    transform: scale(1.2);
  }
`;

const TitleText = styled.span`
  cursor: pointer;
  font-weight: ${(props) => (props.isPinned ? "700" : "500")};
  color: ${Colors.Primary};
  &:hover {
    color: ${Colors.Accent};
    text-decoration: underline;
  }
`;

const Badge = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 700;
  background-color: ${Colors.BgInput};
  color: ${Colors.TextMuted};
`;

// 모달 및 버튼 스타일 (기존과 동일)
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  width: 700px;
  max-height: 85vh;
  overflow-y: auto;
`;

const CommentSection = styled.div`
  margin-top: 2rem;
  border-top: 1px solid ${Colors.Border};
  padding-top: 1.5rem;
`;

const CommentItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px dotted ${Colors.Border};
  font-size: 0.9rem;
`;

const ModalFooter = styled.div`
  margin-top: 3rem;
  display: flex;
  justify-content: center;
  gap: 12px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid
    ${(props) => (props.variant === "danger" ? Colors.Error : Colors.Border)};
  background-color: ${(props) => {
    if (props.variant === "danger") return Colors.Error;
    if (props.variant === "primary") return Colors.Primary;
    return "white";
  }};
  color: ${(props) =>
    props.variant === "danger" || props.variant === "primary"
      ? "white"
      : Colors.Primary};
  &:hover {
    opacity: 0.9;
  }
`;

const PostManagement = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const authorFilter = queryParams.get("author");
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("ALL");
  const [selectedIds, setSelectedIds] = useState([]);
  const [viewPost, setViewPost] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc",
  });

  // 예시 데이터 15개
  const [posts, setPosts] = useState([
    {
      id: 1,
      category: "FREE",
      title: "오늘 점심 메뉴 추천",
      author: "삼성SDI/sa****",
      views: 150,
      likes: 5,
      created_at: "2026-04-15 12:00",
      isPinned: false,
      content: "근처에 맛있는 돈까스집 생겼네요.",
      comments: [
        { id: 101, user: "user1", text: "어딘가요?" },
        { id: 102, user: "user2", text: "정보좀요!" },
      ],
    },
    {
      id: 2,
      category: "FREE",
      title: "주말 등산 가실 분?",
      author: "LG전자/lg****",
      views: 80,
      likes: 2,
      created_at: "2026-04-15 10:30",
      isPinned: false,
      content: "관악산 가려고 합니다.",
      comments: [],
    },
    {
      id: 3,
      category: "FREE",
      title: "이직 성공 후기",
      author: "현대차/hy****",
      views: 1200,
      likes: 55,
      created_at: "2026-04-14 22:10",
      isPinned: false,
      content: "드디어 원하는 곳으로 갑니다.",
      comments: [{ id: 103, user: "u3", text: "축하드려요" }],
    },
    {
      id: 4,
      category: "FREE",
      title: "회사 근처 카페 추천",
      author: "네이버/na****",
      views: 210,
      likes: 8,
      created_at: "2026-04-14 19:00",
      isPinned: false,
      content: "커피가 맛있네요.",
      comments: [],
    },
    {
      id: 5,
      category: "FREE",
      title: "신입 일기 5일차",
      author: "카카오/ka****",
      views: 330,
      likes: 12,
      created_at: "2026-04-13 17:00",
      isPinned: false,
      content: "적응하기 힘드네요.",
      comments: [{ id: 104, user: "u4", text: "화이팅하세요!" }],
    },
    {
      id: 6,
      category: "QNA",
      title: "React Query staleTime 질문",
      author: "배민/wo****",
      views: 560,
      likes: 12,
      created_at: "2026-04-15 11:00",
      isPinned: true,
      content: "staleTime과 cacheTime 차이가 뭔가요?",
      comments: [{ id: 105, user: "dev1", text: "stale은 신선도 기준입니다." }],
    },
    {
      id: 7,
      category: "QNA",
      title: "Spring JPA N+1 문제",
      author: "쿠팡/cp****",
      views: 890,
      likes: 24,
      created_at: "2026-04-15 09:15",
      isPinned: false,
      content: "FetchJoin으로 해결이 안 됩니다.",
      comments: [],
    },
    {
      id: 8,
      category: "QNA",
      title: "Tailwind 색상 커스텀",
      author: "토스/ts****",
      views: 430,
      likes: 5,
      created_at: "2026-04-14 15:00",
      isPinned: false,
      content: "설정 파일에서 추가하는 법 알려주세요.",
      comments: [
        { id: 106, user: "ts_dev", text: "tailwind.config.js 확인해보세요." },
      ],
    },
    {
      id: 9,
      category: "QNA",
      title: "TypeScript Generic 인터페이스",
      author: "당근/dg****",
      views: 220,
      likes: 7,
      created_at: "2026-04-13 11:30",
      isPinned: false,
      content: "T extends keyof 가 자꾸 에러나요.",
      comments: [],
    },
    {
      id: 10,
      category: "QNA",
      title: "Next.js 14 App Router 질문",
      author: "직방/zb****",
      views: 670,
      likes: 18,
      created_at: "2026-04-12 14:20",
      isPinned: false,
      content: "페이지 전환 속도가 느린 것 같아요.",
      comments: [],
    },
    {
      id: 11,
      category: "INFO",
      title: "[필독] 커뮤니티 이용 규칙",
      author: "관리자/admin",
      views: 9999,
      likes: 999,
      created_at: "2026-04-01 00:00",
      isPinned: true,
      content: "매너를 지켜주세요.",
      comments: [],
    },
    {
      id: 12,
      category: "INFO",
      title: "2026 개발자 연봉 리포트",
      author: "원티드/wt****",
      views: 4500,
      likes: 320,
      created_at: "2026-04-14 10:00",
      isPinned: false,
      content: "최신 트렌드 공유합니다.",
      comments: [{ id: 107, user: "user9", text: "좋은 정보 감사합니다." }],
    },
    {
      id: 13,
      category: "INFO",
      title: "Java 21 Virtual Thread 정리",
      author: "오라클/or****",
      views: 1200,
      likes: 95,
      created_at: "2026-04-13 09:00",
      isPinned: false,
      content: "경량 스레드의 도입 배경.",
      comments: [],
    },
    {
      id: 14,
      category: "INFO",
      title: "VSCode 꿀팁 익스텐션 5선",
      author: "MS/ms****",
      views: 2800,
      likes: 140,
      created_at: "2026-04-12 16:00",
      isPinned: false,
      content: "생산성을 높여줍니다.",
      comments: [],
    },
    {
      id: 15,
      category: "INFO",
      title: "React 19 컴파일러 소식",
      author: "메타/mt****",
      views: 3200,
      likes: 210,
      created_at: "2026-04-11 13:00",
      isPinned: false,
      content: "앞으로의 변화가 기대되네요.",
      comments: [{ id: 108, user: "fb_dev", text: "드디어 나오네요." }],
    },
  ]);

  const processedPosts = useMemo(() => {
    let result =
      activeTab === "ALL"
        ? [...posts]
        : posts.filter((p) => p.category === activeTab);

    if (authorFilter) {
      result = result.filter((p) => p.author.includes(authorFilter));
    }

    result.sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];
      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [posts, activeTab, sortConfig, authorFilter]);

  const handleDeletePost = (id, title) => {
    if (window.confirm(`[${title}]\n이 게시글을 정말 삭제하시겠습니까?`)) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
      setViewPost(null);
    }
  };

  const handleDeleteComment = (postId, commentId) => {
    if (window.confirm("이 댓글을 삭제하시겠습니까?")) {
      const updated = posts.map((p) =>
        p.id === postId
          ? { ...p, comments: p.comments.filter((c) => c.id !== commentId) }
          : p,
      );
      setPosts(updated);
      setViewPost(updated.find((p) => p.id === postId));
    }
  };

  return (
    <Container>
      <Wrapper>
        <Header>
          <h1>게시글 통합 관리</h1>
          {/* 5. 필터링 중일 때 안내 문구 표시 (선택 사항) */}
          {authorFilter && (
            <div
              style={{
                color: "#1D6BF3",
                fontWeight: "600",
                marginBottom: "1rem",
              }}
            >
              " {authorFilter} " 사용자의 게시글만 보기 중
            </div>
          )}
        </Header>

        <TabContainer>
          {["ALL", "FREE", "QNA", "INFO"].map((tab) => (
            <Tab
              key={tab}
              active={activeTab === tab}
              onClick={() => {
                setActiveTab(tab);
                setSelectedIds([]);
              }}
            >
              {tab === "ALL" ? "전체" : tab}
            </Tab>
          ))}
        </TabContainer>

        <ContentCard>
          <ActionToolbar>
            <Button
              variant="danger"
              onClick={() => {
                if (
                  window.confirm(
                    `선택한 ${selectedIds.length}개의 게시글을 삭제하시겠습니까?`,
                  )
                ) {
                  setPosts((prev) =>
                    prev.filter((p) => !selectedIds.includes(p.id)),
                  );
                  setSelectedIds([]);
                }
              }}
              disabled={selectedIds.length === 0}
              style={{ opacity: selectedIds.length ? 1 : 0.4 }}
            >
              선택 삭제 ({selectedIds.length})
            </Button>
            <div style={{ fontSize: "0.85rem", color: Colors.TextMuted }}>
              총 {processedPosts.length}건
            </div>
          </ActionToolbar>

          <Table>
            <colgroup>
              <col style={{ width: "60px" }} /> {/* 체크박스 */}
              <col style={{ width: "70px" }} /> {/* ID */}
              {activeTab === "ALL" && <col style={{ width: "100px" }} />}{" "}
              {/* 카테고리 */}
              <col style={{ width: "auto" }} /> {/* 제목 (유동적) */}
              <col style={{ width: "150px" }} /> {/* 작성자 */}
              <col style={{ width: "90px" }} /> {/* 조회 */}
              <col style={{ width: "90px" }} /> {/* 좋아요 */}
              <col style={{ width: "80px" }} /> {/* 댓글 */}
              <col style={{ width: "120px" }} /> {/* 작성일 */}
            </colgroup>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      setSelectedIds(
                        e.target.checked ? processedPosts.map((p) => p.id) : [],
                      )
                    }
                    checked={
                      selectedIds.length === processedPosts.length &&
                      processedPosts.length > 0
                    }
                  />
                </th>
                <th
                  onClick={() =>
                    setSortConfig({
                      key: "id",
                      direction:
                        sortConfig.direction === "asc" ? "desc" : "asc",
                    })
                  }
                >
                  ID
                </th>
                {activeTab === "ALL" && <th>카테고리</th>}
                <th>제목</th>
                <th>작성자</th>
                <th
                  onClick={() =>
                    setSortConfig({
                      key: "views",
                      direction:
                        sortConfig.direction === "asc" ? "desc" : "asc",
                    })
                  }
                >
                  조회
                </th>
                <th
                  onClick={() =>
                    setSortConfig({
                      key: "likes",
                      direction:
                        sortConfig.direction === "asc" ? "desc" : "asc",
                    })
                  }
                >
                  좋아요
                </th>
                <th style={{ textAlign: "center" }}>댓글</th>
                <th
                  onClick={() =>
                    setSortConfig({
                      key: "created_at",
                      direction:
                        sortConfig.direction === "asc" ? "desc" : "asc",
                    })
                  }
                >
                  작성일
                </th>
              </tr>
            </thead>
            <tbody>
              {processedPosts.map((post) => (
                <tr
                  key={post.id}
                  style={{
                    background: post.isPinned ? "#FFFBEB" : "transparent",
                  }}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(post.id)}
                      onChange={() =>
                        setSelectedIds((prev) =>
                          prev.includes(post.id)
                            ? prev.filter((i) => i !== post.id)
                            : [...prev, post.id],
                        )
                      }
                    />
                  </td>
                  <td>{post.id}</td>
                  {activeTab === "ALL" && (
                    <td>
                      <Badge>{post.category}</Badge>
                    </td>
                  )}
                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        overflow: "hidden",
                      }}
                    >
                      <PinIcon
                        isPinned={post.isPinned}
                        onClick={() =>
                          setPosts(
                            posts.map((p) =>
                              p.id === post.id
                                ? { ...p, isPinned: !p.isPinned }
                                : p,
                            ),
                          )
                        }
                      >
                        ★
                      </PinIcon>
                      <TitleText
                        isPinned={post.isPinned}
                        onClick={() => setViewPost(post)}
                      >
                        {post.title}
                      </TitleText>
                    </div>
                  </td>
                  <td>{post.author}</td>
                  <td>{post.views.toLocaleString()}</td>
                  <td>{post.likes.toLocaleString()}</td>
                  <td
                    style={{
                      textAlign: "center",
                      fontWeight: "700",
                      color: Colors.Accent,
                    }}
                  >
                    {post.comments.length}
                  </td>
                  <td>{post.created_at.split(" ")[0]}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </ContentCard>
      </Wrapper>

      {/* 상세보기 모달 */}
      {viewPost && (
        <ModalOverlay onClick={() => setViewPost(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "1.5rem",
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "0.85rem",
                    color: Colors.Accent,
                    fontWeight: "700",
                  }}
                >
                  [{viewPost.category}]
                </span>
                <h2 style={{ marginTop: "0.6rem", fontSize: "1.5rem" }}>
                  {viewPost.title}
                </h2>
                <p
                  style={{
                    color: Colors.TextMuted,
                    fontSize: "0.85rem",
                    marginTop: "4px",
                  }}
                >
                  작성자: {viewPost.author} | {viewPost.created_at} | 조회{" "}
                  {viewPost.views.toLocaleString()} | 좋아요{" "}
                  {viewPost.likes.toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setViewPost(null)}
                style={{
                  border: "none",
                  background: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                }}
              >
                &times;
              </button>
            </div>
            <div
              style={{
                padding: "1.5rem",
                background: Colors.BgMain,
                borderRadius: "8px",
                minHeight: "150px",
                lineHeight: "1.7",
                whiteSpace: "pre-wrap",
              }}
            >
              {viewPost.content}
            </div>
            <CommentSection>
              <h4 style={{ marginBottom: "1rem" }}>
                댓글{" "}
                <span style={{ color: Colors.Accent }}>
                  {viewPost.comments.length}
                </span>
              </h4>
              {viewPost.comments.length === 0 ? (
                <p style={{ fontSize: "0.85rem", color: Colors.TextMuted }}>
                  등록된 댓글이 없습니다.
                </p>
              ) : (
                viewPost.comments.map((comment) => (
                  <CommentItem key={comment.id}>
                    <div>
                      <span style={{ fontWeight: "700", marginRight: "12px" }}>
                        {comment.user}
                      </span>
                      <span>{comment.text}</span>
                    </div>
                    <button
                      onClick={() =>
                        handleDeleteComment(viewPost.id, comment.id)
                      }
                      style={{
                        border: "none",
                        background: "none",
                        color: Colors.Error,
                        fontSize: "0.75rem",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      삭제
                    </button>
                  </CommentItem>
                ))
              )}
            </CommentSection>
            <ModalFooter>
              <Button
                variant="danger"
                onClick={() => handleDeletePost(viewPost.id, viewPost.title)}
              >
                게시글 삭제
              </Button>
              <Button
                variant="primary"
                onClick={() =>
                  navigate(`/admin/users?search=${viewPost.author}`)
                }
              >
                작성자 제재
              </Button>
              <Button onClick={() => setViewPost(null)}>닫기</Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default PostManagement;
