import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "../../context/UserStore";

const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  flex-wrap: wrap;
  margin: 20px auto;
`;

const MemberInfoWrapper = styled.div`
  display: flex;
  margin: 10px;
  width: 100%;
  border: 1px solid #ccc;
  padding: 16px;
  border-radius: 8px;
  background-color: antiquewhite;
  cursor: pointer;
  &:hover { background-color: #f5e6c8; }
`;

const UserInfo = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const UserImagePlaceholder = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 5px;
  margin-right: 10px;
  background-color: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
`;

const MemberName = styled.span`
  font-style: italic;
  font-size: 1.2rem;
  color: #333;
  margin: 10px;
`;

const MemberEmail = styled.span`
  color: #555;
  margin-bottom: 10px;
`;

const MemberJoinDate = styled.span`
  font-size: 0.8rem;
  color: #777;
`;

const Members = () => {
  const navigate = useNavigate();
  const { loginUser } = useContext(UserContext);

  // ✅ Hook은 반드시 조건부 return 전에 선언
  useEffect(() => {
    if (!loginUser) {
      navigate("/");
    }
  }, [loginUser, navigate]);

  const onClickMember = (userId) => {
    navigate(`/memberInfo/${userId}`);
  };

  if (!loginUser) return null;

  return (
    <Container>
      <p style={{ padding: "10px 20px", color: "#666", fontStyle: "italic" }}>
        💡 전체 회원 목록은 백엔드 API 추가 후 연동하세요.
        <br />
        현재는 로그인한 내 정보만 표시됩니다.
      </p>
      <MemberInfoWrapper onClick={() => onClickMember(loginUser.userId)}>
        <UserImagePlaceholder>👤</UserImagePlaceholder>
        <UserInfo>
          <MemberName>이름: {loginUser.name}</MemberName>
          <MemberEmail>이메일: {loginUser.email}</MemberEmail>
          <MemberJoinDate>
            {loginUser.isAdmin ? "👑 관리자" : "일반 회원"}
          </MemberJoinDate>
        </UserInfo>
      </MemberInfoWrapper>
    </Container>
  );
};

export default Members;
