import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AxiosApi from "../../api/AxiosApi";
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

const DashBoard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");
  const [stats, setStats] = useState({
    postTotal: 0,
    postToday: 0,
    userTotal: 0,
    userToday: 0,
    pendingCnt: 0,
    userChartData: [],
    postChartData: [],
    labels: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // ✅ fix 1: 3개 다 destructuring
        const [postRsp, userRsp, pendingRsp] = await Promise.all([
          AxiosApi.getPostList(),
          AxiosApi.getUserList(),
          AxiosApi.getPendingCertList(),
        ]);

        const allPosts = postRsp.data.success ? postRsp.data.data || [] : [];
        const allUsers = userRsp.data.success ? userRsp.data.data || [] : [];
        const pending = pendingRsp.data.success
          ? pendingRsp.data.data || []
          : [];

        // 최근 7일 날짜 배열 생성
        const last7DaysLabels = [];
        const last7DaysFull = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const month = String(d.getMonth() + 1).padStart(2, "0");
          const day = String(d.getDate()).padStart(2, "0");
          last7DaysFull.push(`${d.getFullYear()}-${month}-${day}`);
          last7DaysLabels.push(`${month}/${day}`);
        }

        const userCounts = last7DaysFull.map(
          (date) =>
            allUsers.filter((u) => u.createdAt?.split("T")[0] === date).length,
        );
        const postCounts = last7DaysFull.map(
          (date) =>
            allPosts.filter((p) => p.createdAt?.split("T")[0] === date).length,
        );

        setStats({
          postTotal: allPosts.length,
          postToday: postCounts[6],
          userTotal: allUsers.length,
          userToday: userCounts[6],
          pendingCnt: pending.length, // ✅ fix 1: pendingRsp 데이터 사용
          userChartData: userCounts,
          postChartData: postCounts,
          labels: last7DaysLabels,
        });
      } catch (e) {
        console.error("데이터 로딩 실패:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        grid: { color: Colors.BgInput },
        ticks: {
          color: Colors.TextMuted,
          stepSize: 1,
          callback: (value) => (Number.isInteger(value) ? value : undefined),
        },
        beginAtZero: true,
      },
      x: { grid: { display: false }, ticks: { color: Colors.TextMuted } },
    },
  };

  const chartData = {
    labels: stats.labels,
    datasets: [
      {
        fill: true,
        data: activeTab === "users" ? stats.userChartData : stats.postChartData,
        borderColor: Colors.Accent,
        backgroundColor: `${Colors.Accent}1A`,
        tension: 0.4,
      },
    ],
  };

  return (
    <Container>
      <Wrapper>
        {/* ✅ fix 2: PageHeader 로 통일 */}
        <PageHeader>
          <h1>대시보드</h1>
        </PageHeader>

        <Grid>
          <Card
            onClick={() => navigate("/admin/users")}
            style={{ cursor: "pointer" }}
          >
            <StatSection>
              <label>전체 가입자 수</label>
              <span>
                {loading ? "..." : `${stats.userTotal.toLocaleString()} 명`}
              </span>
            </StatSection>
            <StatSection accent>
              <label>오늘 신규 가입자</label>
              <span>{loading ? "..." : `+${stats.userToday} 명`}</span>
            </StatSection>
          </Card>

          <Card
            onClick={() => navigate("/admin/posts")}
            style={{ cursor: "pointer" }}
          >
            <StatSection>
              <label>전체 게시글 수</label>
              <span>
                {loading ? "..." : `${stats.postTotal.toLocaleString()} 개`}
              </span>
            </StatSection>
            <StatSection accent>
              <label>오늘 신규 게시글</label>
              <span>{loading ? "..." : `+${stats.postToday} 개`}</span>
            </StatSection>
          </Card>

          <ActionCard
            onClick={() => navigate("/admin/users")}
            style={{ cursor: "pointer" }}
          >
            <label style={{ color: Colors.TextMuted, fontSize: "0.875rem" }}>
              인증 대기
            </label>
            <div className="count">{loading ? "..." : stats.pendingCnt}</div>
            <div className="desc">승인 대기 중인 인증 신청</div>
          </ActionCard>
        </Grid>

        <ChartContainer>
          <ChartHeader>
            <h2>시스템 현황</h2>
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
            <Line options={chartOptions} data={chartData} />
          </div>
        </ChartContainer>
      </Wrapper>
    </Container>
  );
};

export default DashBoard;

// ─── 스타일 (✅ fix 3: 중복 제거 후 한 곳에만) ──────────────
const Container = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background-color: ${Colors.BgMain};
`;
const Wrapper = styled.div`
  max-width: 1024px;
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
  background: ${Colors.BgCard};
  border: 1px solid ${Colors.Border};
  border-radius: 8px;
  padding: 1.5rem;
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }
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
    color: ${(p) => (p.accent ? Colors.Accent : Colors.Primary)};
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
  background: ${Colors.BgCard};
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
  background: ${Colors.BgInput};
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
  transition: all 0.2s;
  background: ${(p) => (p.active ? Colors.BgCard : "transparent")};
  color: ${(p) => (p.active ? Colors.Accent : Colors.TextMuted)};
  &:hover {
    color: ${Colors.Accent};
  }
`;
