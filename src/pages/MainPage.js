import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import HeaderBar from "../components/HeaderBar";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import Footer from "../components/Footer";

/* ============================================
   한글 닉네임 리스트
   ============================================ */
const koreanNicknames = [
  "행복한고양이",
  "신나는토끼",
  "멋진독수리",
  "귀여운판다",
  "씩씩한사자",
  "똑똑한여우",
  "용감한호랑이",
  "차분한곰",
  "활발한다람쥐",
  "날렵한매",
  "장난꾸러기원숭이",
  "포근한양",
  "깜찍한펭귄",
  "자유로운참새",
  "든든한거북이",
  "조용한고래",
  "영리한까마귀",
  "청초한백조",
  "우아한공작",
  "힘센소",
  "빠른치타",
  "점프하는캥거루",
  "수줍은사슴",
  "반짝이는나방",
  "성실한벌",
  "꼼꼼한개미",
  "음악하는귀뚜라미",
  "춤추는나비",
  "똑똑한부엉이",
  "날개짓하는독수리",
];

const companies = ["카카오", "네이버", "삼성", "LINE", "Google", "Microsoft"];

// 무작위 닉네임 선택
const getRandomNickname = () => {
  return koreanNicknames[Math.floor(Math.random() * koreanNicknames.length)];
};

const getRandomCompany = () => {
  return companies[Math.floor(Math.random() * companies.length)];
};

// 더미 게시물 생성 함수
const generateDummyPost = (postId, title, baseId) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));

  // 임의의 시간 추가 (0~23시)
  const randomHours = Math.floor(Math.random() * 24);
  const randomMinutes = Math.floor(Math.random() * 60);
  date.setHours(randomHours, randomMinutes, 0, 0);

  return {
    postId,
    title,
    companyName: getRandomCompany(),
    nickname: getRandomNickname(),
    category: "FREE",
    commentCount: Math.floor(Math.random() * 50),
    likeCount: Math.floor(Math.random() * 200),
    viewCount: Math.floor(Math.random() * 1000),
    createdAt: date.toISOString(),
  };
};

/* ============================================
   카테고리별 더미 데이터 (대폭 확장)
   ============================================ */
const dummyDataByCategory = {
  "인기 게시물": [
    {
      postId: 1,
      title: "팀 프로젝트 협업 경험 공유합니다",
      companyName: "카카오",
      nickname: "행복한고양이",
      category: "FREE",
      commentCount: 12,
      likeCount: 48,
      viewCount: 256,
      createdAt: new Date(new Date().setHours(14, 30)).toISOString(),
    },
    {
      postId: 2,
      title: "신입 개발자 첫 프로젝트 회고",
      companyName: "네이버",
      nickname: "신나는토끼",
      category: "INFO",
      commentCount: 24,
      likeCount: 156,
      viewCount: 512,
      createdAt: new Date(new Date().setHours(10, 15)).toISOString(),
    },
    {
      postId: 3,
      title: "업무 효율화를 위한 팁과 경험",
      companyName: "삼성",
      nickname: "멋진독수리",
      category: "FREE",
      commentCount: 18,
      likeCount: 92,
      viewCount: 384,
      createdAt: new Date(new Date().setHours(11, 45)).toISOString(),
    },
  ],
  "자유 게시판": [
    {
      postId: 101,
      title: "팀 회식 문화 어떻게 생각하세요?",
      companyName: "카카오",
      nickname: "멋진독수리",
      category: "FREE",
      commentCount: 8,
      likeCount: 24,
      viewCount: 128,
      createdAt: new Date(new Date().setHours(12, 0)).toISOString(),
    },
    {
      postId: 102,
      title: "직장 동료와의 갈등 해결 경험담",
      companyName: "LINE",
      nickname: "귀여운판다",
      category: "FREE",
      commentCount: 15,
      likeCount: 64,
      viewCount: 256,
      createdAt: new Date(new Date().setHours(9, 30)).toISOString(),
    },
    {
      postId: 103,
      title: "신입 사원 적응 팁 공유합니다",
      companyName: "삼성",
      nickname: "씩씩한사자",
      category: "FREE",
      commentCount: 11,
      likeCount: 45,
      viewCount: 198,
      createdAt: new Date(new Date().setHours(18, 45)).toISOString(),
    },
  ],
  "정보 게시판": [
    {
      postId: 201,
      title: "JavaScript Promise와 async/await 완벽 정리",
      companyName: "네이버",
      nickname: "똑똑한여우",
      category: "INFO",
      commentCount: 32,
      likeCount: 284,
      viewCount: 1024,
      createdAt: new Date(new Date().setHours(9, 0)).toISOString(),
    },
    {
      postId: 202,
      title: "React Hooks vs Class Components 비교분석",
      companyName: "카카오",
      nickname: "용감한호랑이",
      category: "INFO",
      commentCount: 22,
      likeCount: 156,
      viewCount: 612,
      createdAt: new Date(new Date().setHours(14, 30)).toISOString(),
    },
    {
      postId: 203,
      title: "웹 성능 최적화 실전 가이드",
      companyName: "Google",
      nickname: "차분한곰",
      category: "INFO",
      commentCount: 18,
      likeCount: 128,
      viewCount: 456,
      createdAt: new Date(new Date().setHours(11, 15)).toISOString(),
    },
  ],
  "문의 게시판": [
    {
      postId: 301,
      title: "Python과 JavaScript 중 뭘 먼저 배워야 할까요?",
      companyName: "카카오",
      nickname: "날렵한매",
      category: "QNA",
      commentCount: 14,
      likeCount: 76,
      viewCount: 324,
      createdAt: new Date(new Date().setHours(13, 20)).toISOString(),
    },
    {
      postId: 302,
      title: "REST API vs GraphQL 선택 기준이 뭐예요?",
      companyName: "네이버",
      nickname: "장난꾸러기원숭이",
      category: "QNA",
      commentCount: 19,
      likeCount: 102,
      viewCount: 456,
      createdAt: new Date(new Date().setHours(10, 50)).toISOString(),
    },
    {
      postId: 303,
      title: "번아웃 극복하는 방법 조언 부탁드립니다",
      companyName: "삼성",
      nickname: "포근한양",
      category: "QNA",
      commentCount: 12,
      likeCount: 89,
      viewCount: 298,
      createdAt: new Date(new Date().setHours(15, 30)).toISOString(),
    },
  ],
};

/* ============================================
   Styled Components
   ============================================ */
const RootWrapper = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
  color: #1a1a1a;
  display: flex;
  flex-direction: column;
  font-family: "Pretendard", sans-serif;
`;

const NavbarSpacer = styled.div`
  height: 56px;
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
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #ffffff;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
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
  font-family: "Pretendard", sans-serif;
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
  font-family: "Pretendard", sans-serif;

  &:hover {
    background: #f5f5f5;
    border-color: #1d6bf3;
    color: #1d6bf3;
  }
`;

function MainPage() {
  const [activeMenu, setActiveMenu] = useState("인기 게시물");
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  // 페이지 로드 시 맨 위로 스크롤
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 카테고리별 경로 매핑
  const categoryPaths = {
    "인기 게시물": "/popular",
    "자유 게시판": "/freeboard",
    "정보 게시판": "/info",
    "문의 게시판": "/qna",
  };

  // 각 게시판 섹션의 ref
  const sectionRefs = {
    "인기 게시물": useRef(null),
    "자유 게시판": useRef(null),
    "정보 게시판": useRef(null),
    "문의 게시판": useRef(null),
  };

  // 메뉴 클릭 시 해당 섹션으로 스크롤 이동
  const handleMenuClick = (menu) => {
    setActiveMenu(menu);

    // 약간의 지연 후 스크롤 (DOM 업데이트 후)
    setTimeout(() => {
      const element = sectionRefs[menu]?.current;
      if (element) {
        const elementPosition =
          element.getBoundingClientRect().top + window.scrollY;
        const headerHeight = 70; // 헤더바 높이 + 여유 공간
        window.scrollTo({
          top: elementPosition - headerHeight,
          behavior: "smooth",
        });
      }
    }, 100);
  };

  // 게시판 페이지로 이동
  const handleNavigateToBoard = (category) => {
    navigate(categoryPaths[category]);
  };

  // 모든 카테고리 키
  const categories = Object.keys(dummyDataByCategory);

  return (
    <RootWrapper>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; }
        *::before, *::after { box-sizing: border-box; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; }
        html { font-size: 16px; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; -moz-text-size-adjust: 100%; text-size-adjust: 100%; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; text-rendering: optimizeLegibility; }
        body { margin: 0; padding: 0; font-family: 'Pretendard', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; font-size: 16px; line-height: 1.5; letter-spacing: -0.3px; color: #1a1a1a; background-color: transparent; -webkit-font-smoothing: antialiased; -webkit-text-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; text-rendering: optimizeLegibility; -webkit-appearance: none; }
        h1, h2, h3, h4, h5, h6 { margin: 0; padding: 0; font-weight: inherit; font-size: inherit; line-height: 1.2; letter-spacing: inherit; }
        p, span, div, article, section, main { margin: 0; padding: 0; line-height: 1.5; letter-spacing: -0.3px; }
        button { margin: 0; padding: 0; border: none; outline: none; background: none; color: inherit; font-family: 'Pretendard', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; font-size: 16px; font-weight: inherit; cursor: pointer; -webkit-appearance: none; -moz-appearance: none; appearance: none; -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
        button:focus { outline: none; }
        input, textarea, select { margin: 0; padding: 0; border: none; outline: none; background: none; color: inherit; font-family: 'Pretendard', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; font-size: 16px; font-weight: inherit; -webkit-appearance: none; -moz-appearance: none; appearance: none; -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
        input:focus, textarea:focus, select:focus { outline: none; }
        input::placeholder { color: inherit; opacity: 0.7; }
        a { color: inherit; text-decoration: none; background-color: transparent; }
        img { max-width: 100%; height: auto; display: block; border: none; }
        ul, ol, li { margin: 0; padding: 0; list-style: none; }
        table { border-collapse: collapse; border-spacing: 0; }
        td, th { padding: 0; margin: 0; }
      `}</style>

      <HeaderBar searchValue={searchValue} onSearch={setSearchValue} />

      <NavbarSpacer />

      <LayoutWrapper>
        <Navbar
          mode="scroller"
          activeMenu={activeMenu}
          onMenuClick={handleMenuClick}
        />

        <MainContent>
          {/* 모든 카테고리별로 섹션 표시 */}
          {categories.map((category) => {
            const posts = dummyDataByCategory[category];

            // 검색어 필터링
            const filteredPosts = posts.filter((post) =>
              post.title.toLowerCase().includes(searchValue.toLowerCase()),
            );

            return (
              <CategorySection ref={sectionRefs[category]} key={category}>
                <CategoryHeader>
                  <CategoryTitle
                    onClick={() => handleNavigateToBoard(category)}
                  >
                    {category}
                  </CategoryTitle>
                  <LoadMoreButton
                    onClick={() => handleNavigateToBoard(category)}
                  >
                    더보기
                  </LoadMoreButton>
                </CategoryHeader>
                <PostsContainer>
                  {filteredPosts.length > 0 ? (
                    <>
                      {filteredPosts.map((post) => (
                        <Card key={post.postId} post={post} />
                      ))}
                    </>
                  ) : (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "20px",
                        color: "#999999",
                        fontSize: "13px",
                      }}
                    >
                      <p>게시글이 없습니다.</p>
                    </div>
                  )}
                </PostsContainer>
              </CategorySection>
            );
          })}
        </MainContent>
      </LayoutWrapper>

      <Footer />
    </RootWrapper>
  );
}

export default MainPage;
