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
      posts = [...allPosts]
        .sort((a, b) => b.likeCount - a.likeCount)
        .slice(0, 5);
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
    if (section === "인기 게시물") return; // 인기 게시물은 더보기 없음
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

        <MainContent>
          {loading ? (
            <LoadingText>게시글을 불러오는 중...</LoadingText>
          ) : filterCategory ? (
            // ── 카테고리 전체 뷰 ──────────────────────────────
            <CategorySection>
              <CategoryHeader>
                <CategoryTitle>{filterCategory}</CategoryTitle>
                <BackButton onClick={handleBackToMain}>← 전체 보기</BackButton>
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
                    <CategoryTitle onClick={() => handleMenuClick(section)}>
                      {section}
                    </CategoryTitle>
                    {section !== "인기 게시물" && (
                      <LoadMoreButton onClick={() => handleMoreClick(section)}>
                        더보기 {hasMore && `(+${posts.length - PREVIEW_COUNT})`}
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

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 30px;
  min-width: 0;
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
