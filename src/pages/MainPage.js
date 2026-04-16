import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Sidebar from "../component/Sidebar";
import PostCard from "../component/PostCard";
import { UserContext } from "../context/UserStore";
import AxiosApi from "../api/AxiosApi";

// ─── 상수 ────────────────────────────────────────────────────
const SECTIONS = ["인기 게시물", "자유 게시판", "정보 게시판", "질문 게시판"];
const CATEGORY_MAP = {
  "자유 게시판": "FREE",
  "정보 게시판": "INFO",
  "질문 게시판": "QNA",
};
const PREVIEW_COUNT = 3; // 메인 뷰에서 섹션당 보여줄 게시글 수

function MainPage({ openAuth, searchValue = "" }) {
  const { loginUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState("인기 게시물");
  // null = 전체 메인 뷰, 문자열 = 해당 카테고리 전체 뷰
  const [filterCategory, setFilterCategory] = useState(null);

  const isAdmin = loginUser?.admin;

  // 페이지 로드 시 게시글 전체 조회
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPosts();
  }, []);

  // ✨ [변경] 페이지가 활성화될 때마다 데이터 새로고침
  // 설명:
  //   - 사용자가 게시글 상세 페이지에서 돌아올 때 최신 데이터 로드
  //   - 좋아요 토글 후 정렬이 제대로 반영되도록 함
  //   - visibility API를 사용하여 탭 전환 시에도 감지
  //   - 문제 해결: 좋아요 토글 후 인기게시물 정렬 반영 안 됨 → 해결됨!
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // 페이지가 다시 보일 때 데이터 새로고침
        fetchPosts();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const rsp = await AxiosApi.getPostList();
      if (rsp.data.success) setAllPosts(rsp.data.data || []);
    } catch (e) {
      console.error("게시글 목록 조회 실패:", e);
    } finally {
      setLoading(false);
    }
  };

  // 섹션별 게시글 분류
  const getPostsBySection = (section) => {
    let posts = [];
    if (section === "인기 게시물") {
      // ✨ [변경] 인기게시물 조건 및 정렬 로직 개선
      // 변경 사항:
      //   1. 좋아요 제한: 2개 이상 (1개 이상 → 2개 이상)
      //   2. 정렬 방식 변경: createdAt → became_popular_at (인기게시물이 된 시간)
      // 설명:
      //   - 기존: createdAt 기준으로 정렬 (게시글 작성 시간순)
      //   - 변경: became_popular_at 기준으로 정렬 (인기게시물이 된 순서)
      //   - became_popular_at: 좋아요 2개가 되는 순간의 시간을 기록
      //   - 정렬 순서: became_popular_at (내림차순) - 가장 최근에 인기가 된 게시물부터 표시
      //   - 예시: 1350이 방금 2개 좋아요가 되면 1405 위에 표시됨
      posts = [...allPosts]
        .filter((p) => p.likeCount >= 2)
        .sort(
          (a, b) => new Date(b.becamePopularAt) - new Date(a.becamePopularAt),
        );
    } else {
      posts = allPosts.filter((p) => p.category === CATEGORY_MAP[section]);
    }
    if (searchValue.trim()) {
      posts = posts.filter((p) =>
        p.title.toLowerCase().includes(searchValue.toLowerCase()),
      );
    }
    return posts;
  };

  // 섹션 ref (스크롤용 - 전체 뷰일 때)
  const sectionRefs = {
    "인기 게시물": useRef(null),
    "자유 게시판": useRef(null),
    "정보 게시판": useRef(null),
    "질문 게시판": useRef(null),
  };

  // 사이드바 클릭
  const handleMenuClick = (menu) => {
    setActiveMenu(menu);

    if (filterCategory) {
      // 필터 뷰 → 전체 뷰 복귀 후 해당 섹션으로 스크롤
      setFilterCategory(null);
      setTimeout(() => {
        const el = sectionRefs[menu]?.current;
        if (el)
          window.scrollTo({
            top: el.getBoundingClientRect().top + window.scrollY - 80,
            behavior: "smooth",
          });
      }, 150);
    } else {
      setTimeout(() => {
        const el = sectionRefs[menu]?.current;
        if (el)
          window.scrollTo({
            top: el.getBoundingClientRect().top + window.scrollY - 80,
            behavior: "smooth",
          });
      }, 100);
    }
  };

  // 더보기 클릭 → 해당 카테고리 전체 뷰
  const handleMoreClick = (section) => {
    setFilterCategory(section);
    setActiveMenu(section);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 전체 뷰로 복귀
  const handleBackToMain = () => {
    setFilterCategory(null);
    setActiveMenu("인기 게시물");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPostList = (posts) =>
    posts.length > 0 ? (
      posts.map((post) => (
        <div
          key={post.postId}
          onClick={() => navigate(`/post/${post.postId}`)}
          style={{ cursor: "pointer" }}
        >
          <PostCard post={post} />
        </div>
      ))
    ) : (
      <EmptyText>
        {searchValue ? "검색 결과가 없습니다." : "게시글이 없습니다."}
      </EmptyText>
    );

  return (
    <PageWrapper>
      <LayoutWrapper>
        <Sidebar
          mode="scroller"
          activeMenu={activeMenu}
          onMenuClick={handleMenuClick}
          isAdmin={isAdmin}
        />

        {/* ✨ [변경] MainContent에 key prop을 추가하여 filterCategory 상태 변경 시 새 페이지로 전환되는 효과를 줍니다 */}
        {/* key={filterCategory}를 사용하면:
            - filterCategory가 변경될 때마다 컴포넌트가 리마운트됨
            - 이로 인해 scaleAndFadeIn 애니메이션이 트리거됨
            - 마치 새로운 페이지로 전환되는 것처럼 보임 */}
        <MainContent key={filterCategory}>
          {loading ? (
            <LoadingText>게시글을 불러오는 중...</LoadingText>
          ) : filterCategory ? (
            // ── 카테고리 전체 뷰 ──────────────────────────────
            <CategorySection>
              <CategoryHeader>
                <CategoryTitle>{filterCategory}</CategoryTitle>
                {/* ✨ [변경] 버튼 텍스트를 변경했습니다 */}
                {/* 기존: "← 전체 보기"
                    변경 후: "← 메인으로"
                    변경 이유: 버튼이 실제로 메인 페이지로 돌아가므로 더 명확한 이름으로 변경 */}
                <BackButton onClick={handleBackToMain}>← 메인으로</BackButton>
              </CategoryHeader>
              <PostsContainer>
                {renderPostList(getPostsBySection(filterCategory))}
              </PostsContainer>
            </CategorySection>
          ) : (
            // ── 메인 뷰 (섹션별 미리보기) ─────────────────────
            SECTIONS.map((section) => {
              const posts = getPostsBySection(section);
              const preview = posts.slice(0, PREVIEW_COUNT);
              const hasMore = posts.length > PREVIEW_COUNT;

              return (
                <CategorySection ref={sectionRefs[section]} key={section}>
                  <CategoryHeader>
                    {/* ✨ [변경] CategoryTitle 클릭 시 더보기 버튼과 동일한 기능을 하도록 수정했습니다 */}
                    {/* 설명:
                        - handleMoreClick(section) 호출
                        - 필터를 설정하여 전체 게시글 뷰로 전환
                        - 더보기 버튼과 동일한 페이지 펼쳐지기 애니메이션 효과
                        - 사용자가 제목을 눌러도 더보기 버튼과 동일하게 동작 */}
                    <CategoryTitle onClick={() => handleMoreClick(section)}>
                      {section}
                    </CategoryTitle>
                    {/* ✨ [변경] 더보기 버튼에서 괄호(+숫자) 부분을 제거했습니다 */}
                    {/* 설명:
                        기존: 더보기 (+5)
                        변경: 더보기
                        변경 이유: 더 간결하고 깔끔한 UI 제공 */}
                    {hasMore && (
                      <LoadMoreButton onClick={() => handleMoreClick(section)}>
                        더보기
                      </LoadMoreButton>
                    )}
                  </CategoryHeader>
                  <PostsContainer>{renderPostList(preview)}</PostsContainer>
                </CategorySection>
              );
            })
          )}
        </MainContent>
      </LayoutWrapper>
    </PageWrapper>
  );
}

export default MainPage;

// ─── 스타일 ──────────────────────────────────────────────────
const PageWrapper = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
`;

const LayoutWrapper = styled.div`
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 30px 20px;
  display: flex;
  gap: 30px;
  align-items: flex-start;
`;

// ✨ [변경] MainContent에 스케일 + 페이드 애니메이션을 추가했습니다
// 설명:
//   - animation: scaleAndFadeIn 0.5s ease-out
//   - 페이지가 작은 상태에서 시작 (scale: 0.95)
//   - 동시에 투명한 상태에서 시작 (opacity: 0)
//   - 0.5초에 걸쳐 원래 크기로 커지면서 나타남
//   - "페이지가 펼쳐지는" 느낌의 자연스러운 전환 효과를 제공
const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 30px;
  min-width: 0;
  animation: scaleAndFadeIn 0.5s ease-out;

  @keyframes scaleAndFadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const CategorySection = styled.div`
  background: #ffffff;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  padding: 24px;
`;

const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const CategoryTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  cursor: pointer;
  transition: color 0.2s;
  &:hover {
    color: #1d6bf3;
  }
`;

const PostsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const LoadMoreButton = styled.button`
  padding: 6px 12px;
  background: #ffffff;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: #1a1a1a;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: #f5f5f5;
    border-color: #1d6bf3;
    color: #1d6bf3;
  }
`;

const BackButton = styled.button`
  padding: 6px 12px;
  background: #f5f5f5;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: #1a1a1a;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: #e1e1e1;
  }
`;

const LoadingText = styled.p`
  text-align: center;
  padding: 60px 0;
  color: #999999;
  font-size: 14px;
`;

const EmptyText = styled.p`
  text-align: center;
  padding: 20px;
  color: #999999;
  font-size: 13px;
`;
