import { useState, useEffect } from 'react';
import styled from 'styled-components';
import HeaderBar from '../components/HeaderBar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Footer from '../components/Footer';

const postsData = [
  {
    postId: 1,
    title: '팀 프로젝트 협업 경험 공유합니다',
    companyName: '카카오',
    nickname: '행복한고양이',
    category: 'FREE',
    commentCount: 12,
    likeCount: 48,
    viewCount: 256,
    createdAt: new Date(new Date().setHours(14, 30)).toISOString(),
  },
  {
    postId: 2,
    title: '신입 개발자 첫 프로젝트 회고',
    companyName: '네이버',
    nickname: '신나는토끼',
    category: 'INFO',
    commentCount: 24,
    likeCount: 156,
    viewCount: 512,
    createdAt: new Date(new Date().setHours(10, 15)).toISOString(),
  },
  ...Array.from({ length: 18 }, (_, i) => {
    const titles = [
      '원격 근무 생산성 높이는 방법',
      '업계 트렌드 분석 리포트',
      '커리어 전환 후기 나눕니다',
      '회사 문화가 중요한 이유',
      '성공한 프로젝트 사례 분석',
    ];
    
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), 0, 0);
    
    return {
      postId: i + 3,
      title: titles[i % titles.length],
      companyName: ['카카오', '네이버', '삼성', 'LINE', 'Google'][i % 5],
      nickname: ['멋진독수리', '귀여운판다', '씩씩한사자', '똑똑한여우', '용감한호랑이'][i % 5],
      category: 'FREE',
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

function PopularPage() {
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
          mode="navigator" 
          activeMenu="인기 게시물"
          onMenuClick={() => {}} 
        />

        <MainContent>
          <PageTitle>인기 게시물</PageTitle>

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

export default PopularPage;
