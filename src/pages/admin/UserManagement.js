import { useNavigate } from "react-router-dom";
import React, { useState, useMemo } from "react";
import styled from "styled-components";

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
};

// 2. Styled Components
const Container = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background-color: ${Colors.BgMain};
  font-family: "Pretendard", sans-serif;
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

const FilterSection = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 1.5rem;
  background-color: ${Colors.BgCard};
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid ${Colors.Border};
`;

const Select = styled.select`
  padding: 0.5rem 0.8rem;
  border-radius: 6px;
  border: 1px solid ${Colors.Border};
  background-color: white;
  font-size: 0.85rem;
  outline: none;
  cursor: pointer;
  &:focus {
    border-color: ${Colors.Accent};
  }
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
  background-color: ${Colors.Primary};
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
  background-color: ${Colors.BgCard};
  border: 1px solid ${Colors.Border};
  border-radius: 12px;
  overflow: hidden;
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
    cursor: pointer;
    text-align: left;
    &:hover {
      background-color: ${Colors.BgInput};
    }
  }
  td {
    padding: 1.1rem 1rem;
    font-size: 0.85rem;
    border-bottom: 1px solid ${Colors.Border};
    vertical-align: middle;
  }
`;

const TableRow = styled.tr`
  background-color: ${(props) =>
    props.isSuspended ? "#FFF5F5" : "transparent"};
  opacity: ${(props) => (props.isSuspended ? 0.8 : 1)};
  transition: all 0.2s;
`;

const Badge = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  background-color: ${(props) =>
    props.status === "APPROVED"
      ? `${Colors.Success}15`
      : props.status === "REJECTED"
        ? `${Colors.Error}15`
        : Colors.BgInput};
  color: ${(props) =>
    props.status === "APPROVED"
      ? Colors.Success
      : props.status === "REJECTED"
        ? Colors.Error
        : Colors.TextMuted};
`;

const ActionButton = styled.button`
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid
    ${(props) => (props.type === "approve" ? Colors.Accent : Colors.Border)};
  background-color: ${(props) =>
    props.type === "approve" ? Colors.Accent : "white"};
  color: ${(props) => (props.type === "approve" ? "white" : Colors.Error)};
  &:hover {
    opacity: 0.8;
  }
`;

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([
    {
      is_admin: true,
      user_id: 1,
      name: "관리자",
      company_name: "메인 솔루션",
      email: "admin@example.com",
      cert_status: "APPROVED",
      created_at: "2024-01-10",
      is_active: true,
      ban_end_date: "-",
    },
    {
      is_admin: false,
      user_id: 2,
      name: "김철수",
      company_name: "테크 스타트업",
      email: "chulsoo@tech.com",
      cert_status: "PENDING",
      created_at: "2024-04-12",
      is_active: true,
      ban_end_date: "-",
    },
    {
      is_admin: false,
      user_id: 3,
      name: "이영희",
      company_name: "디자인 에이전시",
      email: "young@design.com",
      cert_status: "PENDING",
      created_at: "2024-04-13",
      is_active: true,
      ban_end_date: "-",
    },
    {
      is_admin: false,
      user_id: 4,
      name: "박지성",
      company_name: "에이전트 Q",
      email: "js@agent.com",
      cert_status: "REJECTED",
      created_at: "2024-04-05",
      is_active: false,
      ban_end_date: "영구",
    },
    {
      is_admin: false,
      user_id: 5,
      name: "정민수",
      company_name: "글로벌 IT",
      email: "ms@global.com",
      cert_status: "APPROVED",
      created_at: "2024-03-20",
      is_active: true,
      ban_end_date: "-",
    },
    {
      is_admin: false,
      user_id: 6,
      name: "최유리",
      company_name: "소프트랩",
      email: "yr@softlab.com",
      cert_status: "PENDING",
      created_at: "2024-04-14",
      is_active: true,
      ban_end_date: "-",
    },
    {
      is_admin: false,
      user_id: 7,
      name: "한결",
      company_name: "미래건설",
      email: "hg@future.com",
      cert_status: "APPROVED",
      created_at: "2024-02-15",
      is_active: true,
      ban_end_date: "-",
    },
    {
      is_admin: false,
      user_id: 8,
      name: "송지효",
      company_name: "엔터테인",
      email: "jh@enter.com",
      cert_status: "REJECTED",
      created_at: "2024-03-01",
      is_active: true,
      ban_end_date: "-",
    },
    {
      is_admin: false,
      user_id: 9,
      name: "강호동",
      company_name: "육봉푸드",
      email: "hd@food.com",
      cert_status: "PENDING",
      created_at: "2024-04-11",
      is_active: true,
      ban_end_date: "-",
    },
    {
      is_admin: false,
      user_id: 10,
      name: "유재석",
      company_name: "무한상사",
      email: "js@infinite.com",
      cert_status: "APPROVED",
      created_at: "2024-01-05",
      is_active: true,
      ban_end_date: "-",
    },
  ]);

  const [tempSearchTarget, setTempSearchTarget] = useState("");
  const [tempSearchTerm, setTempSearchTerm] = useState("");
  const [appliedFilter, setAppliedFilter] = useState({ target: "", term: "" });
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc",
  });

  const executeSearch = () => {
    setAppliedFilter({ target: tempSearchTarget, term: tempSearchTerm });
    setTempSearchTerm("");
  };

  const calculateEndDate = (days) => {
    if (days === "perm") return "영구";
    if (days === "clear") return "-";
    const date = new Date();
    date.setDate(date.getDate() + parseInt(days));
    return date.toISOString().split("T")[0];
  };

  // 제재 확인 및 업데이트 함수
  const handleBanUpdate = (user, value) => {
    if (!value) return;

    const labelMap = {
      clear: "제재 해제",
      "1d": "1일 정지",
      "3d": "3일 정지",
      "7d": "7일 정지",
      "15d": "15일 정지",
      perm: "영구 정지",
    };

    const confirmMsg =
      value === "clear"
        ? `[${user.name}] 사용자의 제재를 해제하시겠습니까?`
        : `[${user.name}] 사용자에게 ${labelMap[value]} 제재를 가하시겠습니까?`;

    if (window.confirm(confirmMsg)) {
      setUsers((prev) =>
        prev.map((u) => {
          if (u.user_id === user.user_id) {
            const isActive = value === "clear";
            const endDate = calculateEndDate(value);
            return { ...u, is_active: isActive, ban_end_date: endDate };
          }
          return u;
        }),
      );
    }
  };

  const handleStatusUpdate = (id, name, newStatus) => {
    const action = newStatus === "APPROVED" ? "승인" : "거절";
    if (window.confirm(`[${name}] 사용자의 인증을 ${action}하시겠습니까?`)) {
      setUsers(
        users.map((u) =>
          u.user_id === id ? { ...u, cert_status: newStatus } : u,
        ),
      );
    }
  };

  const processedUsers = useMemo(() => {
    let result = [...users];
    if (appliedFilter.term) {
      const term = appliedFilter.term.toLowerCase();
      result = result.filter((user) =>
        appliedFilter.target === ""
          ? Object.values(user).some((val) =>
              String(val).toLowerCase().includes(term),
            )
          : String(user[appliedFilter.target]).toLowerCase().includes(term),
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

  return (
    <Container>
      <Wrapper>
        <Header>
          <h1>사용자 관리</h1>
        </Header>

        <FilterSection>
          <Select
            value={tempSearchTarget}
            onChange={(e) => setTempSearchTarget(e.target.value)}
          >
            <option value="">전체 검색</option>
            <option value="name">이름</option>
            <option value="company_name">회사명</option>
            <option value="email">이메일</option>
          </Select>
          <Input
            placeholder="검색어를 입력하고 Enter를 누르세요"
            value={tempSearchTerm}
            onChange={(e) => setTempSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && executeSearch()}
          />
          <SearchButton onClick={executeSearch}>검색</SearchButton>
        </FilterSection>

        <TableCard>
          <Table>
            <thead>
              <tr>
                <th
                  onClick={() =>
                    setSortConfig({
                      key: "name",
                      direction:
                        sortConfig.direction === "asc" ? "desc" : "asc",
                    })
                  }
                >
                  이름
                </th>
                <th
                  onClick={() =>
                    setSortConfig({
                      key: "company_name",
                      direction:
                        sortConfig.direction === "asc" ? "desc" : "asc",
                    })
                  }
                >
                  회사명
                </th>
                <th>이메일</th>
                <th
                  onClick={() =>
                    setSortConfig({
                      key: "cert_status",
                      direction:
                        sortConfig.direction === "asc" ? "desc" : "asc",
                    })
                  }
                >
                  인증상태
                </th>
                <th
                  onClick={() =>
                    setSortConfig({
                      key: "created_at",
                      direction:
                        sortConfig.direction === "asc" ? "desc" : "asc",
                    })
                  }
                >
                  생성일
                </th>
                <th
                  onClick={() =>
                    setSortConfig({
                      key: "ban_end_date",
                      direction:
                        sortConfig.direction === "asc" ? "desc" : "asc",
                    })
                  }
                >
                  제한 종료일
                </th>
                <th style={{ textAlign: "center" }}>인증 관리</th>
                <th style={{ textAlign: "center" }}>계정 제재</th>
              </tr>
            </thead>
            <tbody>
              {processedUsers.map((user) => (
                <TableRow key={user.user_id} isSuspended={!user.is_active}>
                  <td>
                    <span
                      onClick={() =>
                        navigate(`/admin/posts?author=${user.name}`)
                      }
                      style={{
                        cursor: "pointer",
                        fontWeight: "700",
                        color: "#1D6BF3", // Accent 색상
                        textDecoration: "underline",
                      }}
                    >
                      {user.name}
                    </span>
                    {user.is_admin && (
                      <span
                        style={{
                          fontSize: "0.6rem",
                          background: "#1A1A1A",
                          color: "white",
                          padding: "2px 4px",
                          borderRadius: "3px",
                          marginLeft: "5px",
                        }}
                      >
                        ADMIN
                      </span>
                    )}
                    {!user.is_active && (
                      <span
                        style={{
                          fontSize: "0.6rem",
                          background: Colors.Error,
                          color: "white",
                          padding: "2px 4px",
                          borderRadius: "3px",
                          marginLeft: "5px",
                        }}
                      >
                        제재 중
                      </span>
                    )}
                  </td>
                  <td>{user.company_name}</td>
                  <td>{user.email}</td>
                  <td>
                    <Badge status={user.cert_status}>{user.cert_status}</Badge>
                  </td>
                  <td>{user.created_at}</td>
                  <td
                    style={{
                      color: !user.is_active ? Colors.Error : "inherit",
                      fontWeight: !user.is_active ? "600" : "400",
                    }}
                  >
                    {user.ban_end_date}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {user.cert_status === "PENDING" ? (
                      <div
                        style={{
                          display: "flex",
                          gap: "5px",
                          justifyContent: "center",
                        }}
                      >
                        <ActionButton
                          type="approve"
                          onClick={() =>
                            handleStatusUpdate(
                              user.user_id,
                              user.name,
                              "APPROVED",
                            )
                          }
                        >
                          승인
                        </ActionButton>
                        <ActionButton
                          onClick={() =>
                            handleStatusUpdate(
                              user.user_id,
                              user.name,
                              "REJECTED",
                            )
                          }
                        >
                          거절
                        </ActionButton>
                      </div>
                    ) : (
                      <span
                        style={{ color: Colors.TextMuted, fontSize: "0.8rem" }}
                      >
                        완료
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {!user.is_admin && (
                      <Select
                        value=""
                        onChange={(e) => handleBanUpdate(user, e.target.value)}
                        style={{ fontSize: "0.75rem", padding: "3px" }}
                      >
                        <option value="">- 선택 -</option>
                        <option value="clear">제재 해제 (활성)</option>
                        <option value="1d">1일 정지</option>
                        <option value="3d">3일 정지</option>
                        <option value="7d">7일 정지</option>
                        <option value="15d">15일 정지</option>
                        <option value="perm">영구 정지</option>
                      </Select>
                    )}
                  </td>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TableCard>
      </Wrapper>
    </Container>
  );
};

export default UserManagement;
