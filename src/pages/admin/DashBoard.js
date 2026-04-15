import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import styled from "styled-components";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

// 1. 색상 팔레트 정의
const Colors = {
  Primary: "#1A1A1A",
  Accent: "#1D6BF3",
  BgCard: "#FFFFFF",
  BgMain: "#F5F5F5",
  BgInput: "#EEEEEE",
  Border: "#E1E1E1",
  TextMuted: "#999999",
  Error: "#E53E3E",
};

// 2. Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

// 3. Styled Components 정의
const Container = styled.div`
  min-height: 100-vh;
  padding: 2rem;
  background-color: ${Colors.BgMain};
  font-family: "Pretendard", sans-serif;
`;

const Wrapper = styled.div`
  max-width: 1024px;
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background-color: ${Colors.BgCard};
  border: 1px solid ${Colors.Border};
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
`;

const StatSection = styled.div`
  &:not(:last-child) {
    border-bottom: 1px solid ${Colors.BgInput};
    padding-bottom: 1rem;
    margin-bottom: 1rem;
  }

  label {
    display: block;
    font-size: 0.875rem;
    color: ${Colors.TextMuted};
    margin-bottom: 0.25rem;
  }

  span {
    font-size: 1.25rem;
    font-weight: 700;
    color: ${(props) => (props.accent ? Colors.Accent : Colors.Primary)};
  }
`;

const ActionCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .count {
    font-size: 2.5rem;
    font-weight: 900;
    color: ${Colors.Error};
    margin: 0.5rem 0;
  }
  .desc {
    font-size: 0.75rem;
    color: ${Colors.TextMuted};
  }
`;

const ChartContainer = styled.div`
  background-color: ${Colors.BgCard};
  border: 1px solid ${Colors.Border};
  border-radius: 16px;
  padding: 2rem;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h2 {
    font-size: 1.125rem;
    font-weight: 700;
    color: ${Colors.Primary};
  }
`;

const TabGroup = styled.div`
  background-color: ${Colors.BgInput};
  padding: 4px;
  border-radius: 8px;
  display: flex;
  gap: 4px;
`;

const TabButton = styled.button`
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${(props) =>
    props.active ? Colors.BgCard : "transparent"};
  color: ${(props) => (props.active ? Colors.Accent : Colors.TextMuted)};
  box-shadow: ${(props) =>
    props.active ? "0 2px 4px rgba(0,0,0,0.05)" : "none"};

  &:hover {
    color: ${Colors.Accent};
  }
`;

const DashBoard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        grid: { color: Colors.BgInput },
        ticks: { color: Colors.TextMuted },
      },
      x: { grid: { display: false }, ticks: { color: Colors.TextMuted } },
    },
  };

  const chartData = {
    labels: ["월", "화", "수", "목", "금", "토", "일"],
    datasets: [
      {
        fill: true,
        data:
          activeTab === "users"
            ? [10, 25, 15, 30, 20, 40, 55]
            : [40, 30, 70, 50, 80, 60, 90],
        borderColor: Colors.Accent,
        backgroundColor: `${Colors.Accent}1A`, // 10% 투명도
        tension: 0.4,
      },
    ],
  };

  return (
    <Container>
      <Wrapper>
        <Header>
          <h1>대시보드</h1>
        </Header>

        <Grid>
          <Card
            onClick={() => navigate("/admin/users")}
            style={{ cursor: "pointer" }}
          >
            <StatSection>
              <label>전체 가입자 수</label>
              <span>1,240 명</span>
            </StatSection>
            <StatSection accent>
              <label>신규 가입자 수</label>
              <span>+24 명</span>
            </StatSection>
          </Card>

          <Card
            onClick={() => navigate("/admin/posts")}
            style={{ cursor: "pointer" }}
          >
            <StatSection>
              <label>전체 게시글 수</label>
              <span>8,520 개</span>
            </StatSection>
            <StatSection accent>
              <label>신규 게시글 수</label>
              <span>+156 개</span>
            </StatSection>
          </Card>

          <ActionCard>
            <label style={{ color: Colors.TextMuted, fontSize: "0.875rem" }}>
              검토 대기
            </label>
            <div className="count">12</div>
            <div className="desc">(추가 or 삭제)</div>
          </ActionCard>
        </Grid>

        <ChartContainer>
          <ChartHeader>
            <h2>시스템 현황 (그래프 - 1주일)</h2>
            <TabGroup>
              <TabButton
                active={activeTab === "users"}
                onClick={() => setActiveTab("users")}
              >
                가입자 수
              </TabButton>
              <TabButton
                active={activeTab === "posts"}
                onClick={() => setActiveTab("posts")}
              >
                게시글 수
              </TabButton>
            </TabGroup>
          </ChartHeader>
          <div style={{ height: "320px" }}>
            <Line options={options} data={chartData} />
          </div>
        </ChartContainer>
      </Wrapper>
    </Container>
  );
};

export default DashBoard;
