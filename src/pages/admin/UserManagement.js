import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import AxiosApi from "../../api/AxiosApi";

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
};

const statusConfig = {
  APPROVED: { label: "승인", color: Colors.Success, bg: "#F0FFF4" },
  REJECTED: { label: "거절", color: Colors.Error, bg: "#FFF5F5" },
  PENDING: { label: "대기중", color: "#D97706", bg: "#FAEEDA" },
  NONE: { label: "미신청", color: Colors.TextMuted, bg: Colors.BgInput },
};

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tempSearchTarget, setTempSearchTarget] = useState("");
  const [tempSearchTerm, setTempSearchTerm] = useState("");
  const [appliedFilter, setAppliedFilter] = useState({ target: "", term: "" });
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });

  // 유저 목록 + 인증 대기 목록 병합
  const fetchData = async () => {
    setLoading(true);
    try {
      const [userRsp, certRsp] = await Promise.all([
        AxiosApi.getUserList(),
        AxiosApi.getPendingCertList(),
      ]);

      if (userRsp.data.success) {
        const allUsers = userRsp.data.data || [];
        // 인증 대기 목록에서 certId 매핑 (승인/거절 시 필요)
        const pendingList = certRsp.data.success ? certRsp.data.data || [] : [];
        const certMap = {};
        pendingList.forEach((c) => {
          certMap[c.userId] = c.certId;
        });

        setUsers(
          allUsers.map((u) => ({
            ...u,
            certId: certMap[u.userId] || null, // PENDING 유저만 certId 있음
          })),
        );
      }
    } catch (e) {
      console.error("유저 목록 조회 실패:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 인증 승인
  const handleApprove = async (user) => {
    if (!user.certId) {
      alert("인증 신청 정보를 찾을 수 없습니다.");
      return;
    }
    if (!window.confirm(`[${user.name}] 인증을 승인하시겠습니까?`)) return;
    try {
      const rsp = await AxiosApi.approveCertification(user.certId);
      if (rsp.data.success) {
        alert("승인 완료!");
        fetchData(); // 목록 갱신
      }
    } catch (e) {
      console.error("승인 실패:", e);
    }
  };

  // 인증 거절
  const handleReject = async (user) => {
    if (!user.certId) {
      alert("인증 신청 정보를 찾을 수 없습니다.");
      return;
    }
    if (!window.confirm(`[${user.name}] 인증을 거절하시겠습니까?`)) return;
    try {
      const rsp = await AxiosApi.rejectCertification(user.certId);
      if (rsp.data.success) {
        alert("거절 완료!");
        fetchData();
      }
    } catch (e) {
      console.error("거절 실패:", e);
    }
  };

  const executeSearch = () => {
    setAppliedFilter({ target: tempSearchTarget, term: tempSearchTerm });
    setTempSearchTerm("");
  };

  const processedUsers = useMemo(() => {
    let result = [...users];
    if (appliedFilter.term) {
      const term = appliedFilter.term.toLowerCase();
      result = result.filter((u) =>
        appliedFilter.target === ""
          ? Object.values(u).some((v) => String(v).toLowerCase().includes(term))
          : String(u[appliedFilter.target]).toLowerCase().includes(term),
      );
    }
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key])
          return sortConfig.direction === "asc" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key])
          return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [users, appliedFilter, sortConfig]);

  const toggleSort = (key) =>
    setSortConfig({
      key,
      direction: sortConfig.direction === "asc" ? "desc" : "asc",
    });

  return (
    <Container>
      <Wrapper>
        <PageHeader>
          <h1>사용자 관리</h1>
        </PageHeader>

        <FilterSection>
          <Select
            value={tempSearchTarget}
            onChange={(e) => setTempSearchTarget(e.target.value)}
          >
            <option value="">전체 검색</option>
            <option value="name">이름</option>
            <option value="companyName">회사명</option>
            <option value="email">이메일</option>
          </Select>
          <Input
            placeholder="검색어 입력 후 Enter"
            value={tempSearchTerm}
            onChange={(e) => setTempSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && executeSearch()}
          />
          <SearchButton onClick={executeSearch}>검색</SearchButton>
        </FilterSection>

        {loading ? (
          <LoadingText>유저 목록을 불러오는 중...</LoadingText>
        ) : (
          <TableCard>
            <Table>
              <thead>
                <tr>
                  <Th
                    onClick={() => toggleSort("name")}
                    style={{ cursor: "pointer" }}
                  >
                    이름
                  </Th>
                  <Th
                    onClick={() => toggleSort("companyName")}
                    style={{ cursor: "pointer" }}
                  >
                    회사명
                  </Th>
                  <Th>이메일</Th>
                  <Th
                    onClick={() => toggleSort("certStatus")}
                    style={{ cursor: "pointer" }}
                  >
                    인증 상태
                  </Th>
                  <Th
                    onClick={() => toggleSort("createdAt")}
                    style={{ cursor: "pointer" }}
                  >
                    가입일
                  </Th>
                  <Th style={{ textAlign: "center" }}>인증 관리</Th>
                </tr>
              </thead>
              <tbody>
                {processedUsers.map((user) => {
                  const cfg =
                    statusConfig[user.certStatus] || statusConfig["NONE"];
                  const dateStr = user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("ko-KR")
                    : "-";
                  return (
                    <tr key={user.userId}>
                      <Td>
                        <span
                          onClick={() =>
                            navigate(`/admin/posts?author=${user.name}`)
                          }
                          style={{
                            cursor: "pointer",
                            fontWeight: 700,
                            color: Colors.Accent,
                            textDecoration: "underline",
                          }}
                        >
                          {user.name}
                        </span>
                        {user.isAdmin && <AdminBadge>ADMIN</AdminBadge>}
                      </Td>
                      <Td>{user.companyName || "-"}</Td>
                      <Td>{user.email}</Td>
                      <Td>
                        <Badge
                          style={{ color: cfg.color, backgroundColor: cfg.bg }}
                        >
                          {cfg.label}
                        </Badge>
                      </Td>
                      <Td>{dateStr}</Td>
                      <Td style={{ textAlign: "center" }}>
                        {user.certStatus === "PENDING" ? (
                          <ActionRow>
                            <ApproveBtn onClick={() => handleApprove(user)}>
                              승인
                            </ApproveBtn>
                            <RejectBtn onClick={() => handleReject(user)}>
                              거절
                            </RejectBtn>
                          </ActionRow>
                        ) : (
                          <span
                            style={{
                              color: Colors.TextMuted,
                              fontSize: "0.8rem",
                            }}
                          >
                            -
                          </span>
                        )}
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </TableCard>
        )}
      </Wrapper>
    </Container>
  );
};

export default UserManagement;

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
const FilterSection = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 1.5rem;
  background: ${Colors.BgCard};
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid ${Colors.Border};
`;
const Select = styled.select`
  padding: 0.5rem 0.8rem;
  border-radius: 6px;
  border: 1px solid ${Colors.Border};
  background: white;
  font-size: 0.85rem;
  outline: none;
  cursor: pointer;
`;
const Input = styled.input`
  flex: 1;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid ${Colors.Border};
  font-size: 0.9rem;
  outline: none;
  &:focus {
    border-color: ${Colors.Accent};
  }
`;
const SearchButton = styled.button`
  padding: 0.5rem 1.5rem;
  background: ${Colors.Primary};
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;
const TableCard = styled.div`
  background: ${Colors.BgCard};
  border: 1px solid ${Colors.Border};
  border-radius: 12px;
  overflow: hidden;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;
const Th = styled.th`
  background: #fafafa;
  padding: 1rem;
  font-size: 0.85rem;
  color: ${Colors.TextMuted};
  border-bottom: 1px solid ${Colors.Border};
  text-align: left;
  &:hover {
    background: ${Colors.BgInput};
  }
`;
const Td = styled.td`
  padding: 1.1rem 1rem;
  font-size: 0.85rem;
  border-bottom: 1px solid ${Colors.Border};
  vertical-align: middle;
`;
const Badge = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
`;
const AdminBadge = styled.span`
  font-size: 0.6rem;
  background: ${Colors.Primary};
  color: white;
  padding: 2px 4px;
  border-radius: 3px;
  margin-left: 5px;
`;
const ActionRow = styled.div`
  display: flex;
  gap: 6px;
  justify-content: center;
`;
const ApproveBtn = styled.button`
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid ${Colors.Accent};
  background: ${Colors.Accent};
  color: white;
  &:hover {
    opacity: 0.85;
  }
`;
const RejectBtn = styled.button`
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid ${Colors.Border};
  background: white;
  color: ${Colors.Error};
  &:hover {
    opacity: 0.85;
  }
`;
const LoadingText = styled.p`
  text-align: center;
  padding: 60px 0;
  color: ${Colors.TextMuted};
  font-size: 14px;
`;
