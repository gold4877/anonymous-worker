import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";

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

// --- 유틸리티 함수: 날짜 표시 로직 ---
const formatDateTime = (dateStr) => {
  if (!dateStr) return "-";
  const targetDate = new Date(dateStr);
  const now = new Date();

  const isToday =
    targetDate.getFullYear() === now.getFullYear() &&
    targetDate.getMonth() === now.getMonth() &&
    targetDate.getDate() === now.getDate();

  if (isToday) {
    return dateStr.split(" ")[1].substring(0, 5);
  } else {
    return dateStr.split(" ")[0];
  }
};

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

  // --- 검색 관련 상태 ---
  const [searchType, setSearchType] = useState("author"); // 기본값 작성자
  const [searchKeyword, setSearchKeyword] = useState(""); // 입력창에 타이핑되는 값
  const [appliedSearch, setAppliedSearch] = useState({ type: "", keyword: "" }); // 실제 검색 적용값

  const [posts, setPosts] = useState([
    {
      id: 1,
      category: "FREE",
      title: "오늘 점심 메뉴 추천",
      author: "삼성SDI/sa****",
      views: 150,
      likes: 5,
      created_at: "2026-04-15 12:00:00",
      updated_at: null,
      isPinned: false,
      content: "근처에 맛있는 돈까스집 생겼네요.",
      comments: [
        {
          id: 101,
          user: "user1",
          text: "어딘가요?",
          created_at: "2026-04-15 12:05:00",
          updated_at: null,
        },
      ],
    },
    {
      id: 2,
      category: "FREE",
      title: "주말 등산 가실 분?",
      author: "LG전자/lg****",
      views: 80,
      likes: 2,
      created_at: "2026-04-15 10:30:00",
      updated_at: "2026-04-15 11:45:00",
      isPinned: false,
      content: "관악산 가려고 합니다.",
      comments: [],
    },
    {
      id: 3,
      category: "QNA",
      title: "React Query 질문있습니다.",
      author: "네이버/na****",
      views: 320,
      likes: 8,
      created_at: "2026-04-14 15:20:00",
      updated_at: null,
      isPinned: false,
      content: "staleTime 설정은 보통 어떻게 하시나요?",
      comments: [],
    },
    {
      id: 4,
      category: "INFO",
      title: "이번달 업계 동향 정리",
      author: "현대차/hy****",
      views: 1200,
      likes: 45,
      created_at: "2026-04-13 09:00:00",
      updated_at: "2026-04-14 10:00:00",
      isPinned: true,
      content: "상당히 흥미로운 소식들이 많네요.",
      comments: [],
    },
  ]);

  // --- 카테고리 탭 변경 시 초기화 로직 ---
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedIds([]);
    setSearchKeyword(""); // 입력창 비우기
    setAppliedSearch({ type: "", keyword: "" }); // 적용된 필터 삭제
  };

  // --- 검색 실행 (버튼 클릭/엔터) ---
  const handleSearch = () => {
    const trimmed = searchKeyword.trim();
    if (!trimmed) {
      alert("검색어를 입력해주세요.");
      return;
    }
    // 필터 적용
    setAppliedSearch({ type: searchType, keyword: trimmed });
    // 검색 후 입력창을 비워달라고 하셔서 추가함
    setSearchKeyword("");
  };

  const onKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  // --- 데이터 필터링 및 정렬 ---
  const processedPosts = useMemo(() => {
    // 1. 카테고리 필터
    let result =
      activeTab === "ALL"
        ? [...posts]
        : posts.filter((p) => p.category === activeTab);

    // 2. URL 파라미터 필터 (작성자 필터가 넘어왔을 때)
    if (authorFilter) {
      result = result.filter((p) => p.author.includes(authorFilter));
    }

    // 3. 우측 통합 검색창 필터
    if (appliedSearch.keyword) {
      result = result.filter((p) => {
        const dataValue = p[appliedSearch.type]; // author, created_at, updated_at
        if (!dataValue) return false;
        return String(dataValue)
          .toLowerCase()
          .includes(appliedSearch.keyword.toLowerCase());
      });
    }

    // 4. 정렬 로직 (고정글 우선 후 선택 정렬)
    result.sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];
      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [posts, activeTab, sortConfig, authorFilter, appliedSearch]);

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
      const targetPost = updated.find((p) => p.id === postId);
      if (targetPost) setViewPost(targetPost);
    }
  };

  return (
    <Container>
      <Wrapper>
        <Header>
          <h1>게시글 통합 관리</h1>
          {authorFilter && (
            <div
              style={{
                color: Colors.Accent,
                fontWeight: "600",
                marginBottom: "1rem",
              }}
            >
              " {authorFilter} " 사용자의 게시글만 필터링 중
            </div>
          )}
        </Header>

        <TopBar>
          <TabContainer>
            {["ALL", "FREE", "QNA", "INFO"].map((tab) => (
              <Tab
                key={tab}
                active={activeTab === tab}
                onClick={() => handleTabChange(tab)}
              >
                {tab === "ALL" ? "전체" : tab}
              </Tab>
            ))}
          </TabContainer>

          <SearchWrapper>
            <SearchSelect
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="author">작성자</option>
              <option value="created_at">작성일</option>
              <option value="updated_at">수정일</option>
            </SearchSelect>
            <SearchInputBox>
              <input
                placeholder="검색어 입력"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={onKeyPress}
              />
              <SearchButton onClick={handleSearch}>
                <AiOutlineSearch size={18} />
              </SearchButton>
            </SearchInputBox>
          </SearchWrapper>
        </TopBar>

        <ContentCard>
          <ActionToolbar>
            <Button
              variant="danger"
              onClick={() => {
                if (
                  window.confirm(
                    `선택한 ${selectedIds.length}개의 글을 삭제하시겠습니까?`,
                  )
                ) {
                  setPosts(posts.filter((p) => !selectedIds.includes(p.id)));
                  setSelectedIds([]);
                }
              }}
              disabled={selectedIds.length === 0}
              style={{ opacity: selectedIds.length ? 1 : 0.4 }}
            >
              선택 삭제 ({selectedIds.length})
            </Button>
            <div style={{ fontSize: "0.85rem", color: Colors.TextMuted }}>
              결과: {processedPosts.length}건
            </div>
          </ActionToolbar>

          <Table>
            <colgroup>
              <col style={{ width: "50px" }} />
              <col style={{ width: "60px" }} />
              {activeTab === "ALL" && <col style={{ width: "90px" }} />}
              <col style={{ width: "auto" }} />
              <col style={{ width: "130px" }} />
              <col style={{ width: "70px" }} />
              <col style={{ width: "70px" }} />
              <col style={{ width: "120px" }} />
              <col style={{ width: "120px" }} />
            </colgroup>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length === processedPosts.length &&
                      processedPosts.length > 0
                    }
                    onChange={(e) =>
                      setSelectedIds(
                        e.target.checked ? processedPosts.map((p) => p.id) : [],
                      )
                    }
                  />
                </th>
                <th>ID</th>
                {activeTab === "ALL" && <th>카테고리</th>}
                <th>제목</th>
                <th>작성자</th>
                <th>조회</th>
                <th>좋아요</th>
                <th>작성일</th>
                <th>수정일</th>
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
                    <div style={{ display: "flex", alignItems: "center" }}>
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
                      <TitleText onClick={() => setViewPost(post)}>
                        {post.title}
                      </TitleText>
                    </div>
                  </td>
                  <td>{post.author}</td>
                  <td>{post.views}</td>
                  <td>{post.likes}</td>
                  <td>{formatDateTime(post.created_at)}</td>
                  <td>
                    {post.updated_at ? formatDateTime(post.updated_at) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </ContentCard>
      </Wrapper>

      {/* 게시글 상세 보기 모달 */}
      {viewPost && (
        <ModalOverlay onClick={() => setViewPost(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h2>{viewPost.title}</h2>
              <Badge>{viewPost.category}</Badge>
            </ModalHeader>
            <div
              style={{ margin: "1rem 0", fontSize: "0.9rem", color: "#666" }}
            >
              작성자: {viewPost.author} | 작성일: {viewPost.created_at}
            </div>
            <div
              style={{
                minHeight: "150px",
                padding: "1rem",
                background: "#f9f9f9",
                borderRadius: "8px",
                whiteSpace: "pre-wrap",
              }}
            >
              {viewPost.content}
            </div>
            <h3 style={{ marginTop: "1.5rem", fontSize: "1rem" }}>
              댓글 ({viewPost.comments.length})
            </h3>
            <CommentSection>
              {viewPost.comments.length === 0 ? (
                <p style={{ color: "#999" }}>댓글이 없습니다.</p>
              ) : (
                viewPost.comments.map((c) => (
                  <CommentItem key={c.id}>
                    <div>
                      <strong>{c.user}</strong>: {c.text}
                    </div>
                    <button
                      onClick={() => handleDeleteComment(viewPost.id, c.id)}
                      style={{
                        color: Colors.Error,
                        border: "none",
                        background: "none",
                        cursor: "pointer",
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
              <Button onClick={() => setViewPost(null)}>닫기</Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default PostManagement;

// --- Styled Components ---
const Container = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background-color: ${Colors.BgMain};
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
const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 1px solid ${Colors.Border};
`;
const TabContainer = styled.div`
  display: flex;
  gap: 8px;
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
  margin-bottom: -1px;
  z-index: 1;
`;
const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;
const SearchSelect = styled.select`
  height: 36px;
  padding: 0 8px;
  border: 1px solid ${Colors.Border};
  border-radius: 6px;
  font-size: 0.85rem;
  outline: none;
`;
const SearchInputBox = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid ${Colors.Border};
  border-radius: 6px;
  padding: 0 10px;
  height: 36px;
  input {
    border: none;
    outline: none;
    font-size: 0.85rem;
    width: 160px;
  }
`;
const SearchButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  color: ${Colors.TextMuted};
`;
const ContentCard = styled.div`
  background-color: ${Colors.BgCard};
  border: 1px solid ${Colors.Border};
  border-radius: 0 0 12px 12px;
  padding: 1.5rem;
  border-top: none;
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
  th {
    background-color: #fafafa;
    padding: 1rem;
    font-size: 0.85rem;
    color: ${Colors.TextMuted};
    border-bottom: 1px solid ${Colors.Border};
    text-align: left;
  }
  td {
    padding: 1.1rem 1rem;
    font-size: 0.85rem;
    border-bottom: 1px solid ${Colors.Border};
  }
`;
const PinIcon = styled.span`
  cursor: pointer;
  margin-right: 12px;
  color: ${(props) => (props.isPinned ? Colors.Warning : "#DDD")};
`;
const TitleText = styled.span`
  cursor: pointer;
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
const Button = styled.button`
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid
    ${(props) => (props.variant === "danger" ? Colors.Error : Colors.Border)};
  background-color: ${(props) =>
    props.variant === "danger"
      ? Colors.Error
      : props.variant === "primary"
        ? Colors.Primary
        : "white"};
  color: ${(props) =>
    props.variant === "danger" || props.variant === "primary"
      ? "white"
      : Colors.Primary};
`;
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;
const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
`;
const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${Colors.Border};
  padding-bottom: 1rem;
`;
const ModalFooter = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;
const CommentSection = styled.div`
  margin-top: 1rem;
  border-top: 1px solid ${Colors.Border};
`;
const CommentItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.8rem 0;
  border-bottom: 1px dotted #eee;
  font-size: 0.85rem;
`;
