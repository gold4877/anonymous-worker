import { useState, useEffect, useMemo, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { AiOutlineSearch } from "react-icons/ai";
import AxiosApi from "../../api/AxiosApi";
import { UserContext } from "../../context/UserStore";

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

const categoryLabel = { FREE: "자유", QNA: "질문/답변", INFO: "정보" };

const formatDateTime = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) {
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  }
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
};

const PostManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser } = useContext(UserContext);

  const queryParams = new URLSearchParams(location.search);
  const authorFilter = queryParams.get("author");

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  const [selectedIds, setSelectedIds] = useState([]);
  const [viewPost, setViewPost] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });
  const [searchType, setSearchType] = useState("title");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [appliedSearch, setAppliedSearch] = useState({ type: "", keyword: "" });

  // 게시글 목록 조회
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const rsp = await AxiosApi.getPostList();
      if (rsp.data.success) setPosts(rsp.data.data || []);
    } catch (e) {
      console.error("게시글 목록 조회 실패:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // 단건 삭제
  const handleDeletePost = async (post) => {
    if (!loginUser) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!window.confirm(`[${post.title}]\n이 게시글을 삭제하시겠습니까?`))
      return;
    try {
      const rsp = await AxiosApi.deletePost(post.postId, loginUser.userId);
      if (rsp.data.success) {
        alert("삭제 완료!");
        setViewPost(null);
        fetchPosts();
      }
    } catch (e) {
      console.error("게시글 삭제 실패:", e);
    }
  };

  // 선택 삭제
  const handleBulkDelete = async () => {
    if (!loginUser || selectedIds.length === 0) return;
    if (!window.confirm(`선택한 ${selectedIds.length}개를 삭제하시겠습니까?`))
      return;
    try {
      await Promise.all(
        selectedIds.map((id) => AxiosApi.deletePost(id, loginUser.userId)),
      );
      setSelectedIds([]);
      fetchPosts();
    } catch (e) {
      console.error("선택 삭제 실패:", e);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedIds([]);
    setSearchKeyword("");
    setAppliedSearch({ type: "", keyword: "" });
  };

  const handleSearch = () => {
    if (!searchKeyword.trim()) {
      alert("검색어를 입력해주세요.");
      return;
    }
    setAppliedSearch({ type: searchType, keyword: searchKeyword.trim() });
    setSearchKeyword("");
  };

  const processedPosts = useMemo(() => {
    let result =
      activeTab === "ALL"
        ? [...posts]
        : posts.filter((p) => p.category === activeTab);
    if (authorFilter)
      result = result.filter((p) => (p.userName || "").includes(authorFilter));
    if (appliedSearch.keyword) {
      result = result.filter((p) => {
        const val = p[appliedSearch.type];
        return (
          val &&
          String(val)
            .toLowerCase()
            .includes(appliedSearch.keyword.toLowerCase())
        );
      });
    }
    result.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [posts, activeTab, sortConfig, authorFilter, appliedSearch]);

  return (
    <Container>
      <Wrapper>
        <PageHeader>
          <h1>게시글 관리</h1>
          {authorFilter && (
            <FilterNotice>
              "{authorFilter}" 사용자의 게시글 필터링 중
            </FilterNotice>
          )}
        </PageHeader>

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
              <option value="title">제목</option>
              <option value="userName">작성자</option>
            </SearchSelect>
            <SearchInputBox>
              <input
                placeholder="검색어 입력"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <SearchButton onClick={handleSearch}>
                <AiOutlineSearch size={18} />
              </SearchButton>
            </SearchInputBox>
          </SearchWrapper>
        </TopBar>

        {loading ? (
          <LoadingText>게시글을 불러오는 중...</LoadingText>
        ) : (
          <ContentCard>
            <ActionToolbar>
              <DeleteBtn
                onClick={handleBulkDelete}
                disabled={selectedIds.length === 0}
                style={{ opacity: selectedIds.length ? 1 : 0.4 }}
              >
                선택 삭제 ({selectedIds.length})
              </DeleteBtn>
              <span style={{ fontSize: "0.85rem", color: Colors.TextMuted }}>
                결과: {processedPosts.length}건
              </span>
            </ActionToolbar>

            <Table>
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
                          e.target.checked
                            ? processedPosts.map((p) => p.postId)
                            : [],
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
                </tr>
              </thead>
              <tbody>
                {processedPosts.map((post) => (
                  <tr key={post.postId}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(post.postId)}
                        onChange={() =>
                          setSelectedIds((prev) =>
                            prev.includes(post.postId)
                              ? prev.filter((i) => i !== post.postId)
                              : [...prev, post.postId],
                          )
                        }
                      />
                    </td>
                    <td>{post.postId}</td>
                    {activeTab === "ALL" && (
                      <td>
                        <CategoryBadge>
                          {categoryLabel[post.category] || post.category}
                        </CategoryBadge>
                      </td>
                    )}
                    <td>
                      <TitleText onClick={() => setViewPost(post)}>
                        {post.title}
                      </TitleText>
                    </td>
                    <td>
                      {post.companyName ? `[${post.companyName}]` : "[무소속]"}{" "}
                      {post.maskedEmail}
                    </td>
                    <td>{post.viewCount}</td>
                    <td>{post.likeCount}</td>
                    <td>{formatDateTime(post.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </ContentCard>
        )}
      </Wrapper>

      {/* 게시글 상세 모달 */}
      {viewPost && (
        <ModalOverlay onClick={() => setViewPost(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h2>{viewPost.title}</h2>
              <CategoryBadge>
                {categoryLabel[viewPost.category] || viewPost.category}
              </CategoryBadge>
            </ModalHeader>
            <ModalMeta>
              작성자:{" "}
              {viewPost.companyName ? `[${viewPost.companyName}]` : "[무소속]"}{" "}
              {viewPost.maskedEmail}
              &nbsp;| 작성일: {formatDateTime(viewPost.createdAt)}
            </ModalMeta>
            <ModalBody>{viewPost.content}</ModalBody>
            <ModalFooter>
              <DeleteBtn onClick={() => handleDeletePost(viewPost)}>
                게시글 삭제
              </DeleteBtn>
              <CloseBtn onClick={() => setViewPost(null)}>닫기</CloseBtn>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default PostManagement;

// ─── 스타일 ──────────────────────────────────────────────────
const Container = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background: ${Colors.BgMain};
`;
const Wrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;
const PageHeader = styled.header`
  margin-bottom: 2rem;
  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${Colors.Primary};
  }
`;
const FilterNotice = styled.div`
  color: ${Colors.Accent};
  font-weight: 600;
  margin-top: 0.5rem;
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
  background: ${(p) => (p.active ? Colors.BgCard : "transparent")};
  border: 1px solid ${(p) => (p.active ? Colors.Border : "transparent")};
  border-bottom: ${(p) => (p.active ? `2px solid ${Colors.BgCard}` : "none")};
  border-radius: 8px 8px 0 0;
  font-weight: ${(p) => (p.active ? 700 : 500)};
  color: ${(p) => (p.active ? Colors.Accent : Colors.TextMuted)};
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
  background: ${Colors.BgCard};
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
    background: #fafafa;
    padding: 1rem;
    font-size: 0.85rem;
    color: ${Colors.TextMuted};
    border-bottom: 1px solid ${Colors.Border};
    text-align: left;
  }
  td {
    padding: 1rem;
    font-size: 0.85rem;
    border-bottom: 1px solid ${Colors.Border};
  }
`;
const CategoryBadge = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 700;
  background: ${Colors.BgInput};
  color: ${Colors.TextMuted};
`;
const TitleText = styled.span`
  cursor: pointer;
  &:hover {
    color: ${Colors.Accent};
    text-decoration: underline;
  }
`;
const DeleteBtn = styled.button`
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid ${Colors.Error};
  background: ${Colors.Error};
  color: white;
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;
const CloseBtn = styled.button`
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid ${Colors.Border};
  background: white;
  color: ${Colors.Primary};
`;
const LoadingText = styled.p`
  text-align: center;
  padding: 60px 0;
  color: ${Colors.TextMuted};
  font-size: 14px;
`;
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
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
  h2 {
    font-size: 1.1rem;
    font-weight: 700;
  }
`;
const ModalMeta = styled.div`
  margin: 1rem 0;
  font-size: 0.9rem;
  color: #666;
`;
const ModalBody = styled.div`
  min-height: 100px;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
  white-space: pre-wrap;
  font-size: 0.9rem;
`;
const ModalFooter = styled.div`
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;
