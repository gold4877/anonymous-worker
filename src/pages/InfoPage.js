import { useState, useEffect } from 'react';
import styled from 'styled-components';
import HeaderBar from '../components/HeaderBar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Footer from '../components/Footer';

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

const postsData = [
  {
    postId: 201,
    title: 'JavaScript Promise와 async/await 완벽 정리',
    companyName: '네이버',
    nickname: '똑똑한여우',
    category: 'INFO',
    commentCount: 32,
    likeCount: 284,
    viewCount: 1024,
    createdAt: new Date(new Date().setHours(9, 0)).toISOString(),
  },
  {
    postId: 202,
    title: 'React Hooks vs Class Components 비교분석',
    companyName: '카카오',
    nickname: '용감한호랑이',
    category: 'INFO',
    commentCount: 22,
    likeCount: 156,
    viewCount: 612,
    createdAt: new Date(new Date().setHours(14, 30)).toISOString(),
  },
  {
    postId: 203,
    title: '웹 성능 최적화 실전 가이드',
    companyName: 'Google',
    nickname: '차분한곰',
    category: 'INFO',
    commentCount: 18,
    likeCount: 128,
    viewCount: 456,
    createdAt: new Date(new Date().setHours(11, 15)).toISOString(),
  },
  {
    postId: 204,
    title: 'TypeScript 입문 가이드',
    companyName: 'Microsoft',
    nickname: '활발한다람쥐',
    category: 'INFO',
    commentCount: 25,
    likeCount: 192,
    viewCount: 748,
    createdAt: new Date(new Date().setHours(16, 45)).toISOString(),
  },
  ...Array.from({ length: 16 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), 0, 0);
    
    return {
      postId: i + 205,
      title: `게시글 ${i + 5}`,
      companyName: ['카카오', '네이버', '삼성', 'Google', 'Microsoft'][i % 5],
      nickname: ['날렵한매', '장난꾸러기원숭이', '포근한양', '깜찍한펭귄', '자유로운참새'][i % 5],
      category: 'INFO',
      commentCount: Math.floor(Math.random() * 50),
      likeCount: Math.floor(Math.random() * 200),
      viewCount: Math.floor(Math.random() * 1000),
      createdAt: date.toISOString(),
    };
  }),
];

const RootWrapper = styled.div`
  min-height: 100vh;
  background: #F5F5F5;
  color: #1A1A1A;
  display: flex;
  flex-direction: column;
  font-family: 'Pretendard', sans-serif;
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
  gap: 16px;
  min-width: 0;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #1A1A1A;
  margin: 0 0 20px 0;
  font-family: 'Pretendard', sans-serif;
`;

const LoadMoreButton = styled.button`
  align-self: center;
  padding: 12px 32px;
  background: #FFFFFF;
  border: 2px solid #E1E1E1;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #1A1A1A;
  margin-top: 16px;
  transition: all 0.2s;
  font-family: 'Pretendard', sans-serif;
  cursor: pointer;

  &:hover {
    border-color: #1D6BF3;
    color: #1D6BF3;
  }
`;

function InfoPage() {
  const [searchValue, setSearchValue] = useState('');

  // 페이지 로드 시 맨 위로 스크롤
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredPosts = postsData.filter((post) =>
    post.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <RootWrapper>
      <style>{globalStyles}</style>

      <HeaderBar searchValue={searchValue} onSearch={setSearchValue} />

      <NavbarSpacer />

      <LayoutWrapper>
        <Navbar 
          mode="navigator" 
          activeMenu="정보 게시판"
          onMenuClick={() => {}} 
        />

        <MainContent>
          <PageTitle>정보 게시판</PageTitle>

          {filteredPosts.length > 0 ? (
            <>
              {filteredPosts.map((post) => (
                <Card key={post.postId} post={post} />
              ))}
            </>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#999999',
              }}
            >
              <p style={{ fontSize: '14px' }}>게시글이 없습니다.</p>
            </div>
          )}
        </MainContent>
      </LayoutWrapper>

      <Footer />
    </RootWrapper>
  );
}

export default InfoPage;
