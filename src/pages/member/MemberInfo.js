import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useState, useEffect, useContext } from "react";
import AxiosApi from "../../api/AxiosApi";
import Commons from "../../utils/Commons";
import { UserContext } from "../../context/UserStore";

const Container = styled.div`
  padding: 24px;
  border: 1px solid #ddd;
  border-radius: 8px;
  max-width: 360px;
  margin: 20px auto;
  background: rgba(0, 0, 0, 0.2);
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const UserName = styled.h2`
  margin-left: 20px;
  color: white;
`;

const UserImagePlaceholder = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 5px;
  background-color: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
`;

const Field = styled.div`
  margin-bottom: 12px;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 8px;
  margin-top: 4px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Label = styled.label`
  display: block;
  margin: 12px 0;
  font-weight: bold;
  color: white;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  background-color: ${(props) => props.color || "#4caf50"};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    opacity: 0.85;
  }
`;

const MemberInfo = () => {
  const { userId } = useParams();           // App.js에서 :userId로 변경됨
  const navigate = useNavigate();
  const { loginUser, setLoginUser } = useContext(UserContext);

  const [member, setMember] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const rsp = await AxiosApi.getUser(userId);
        // mini_project_base 응답: { success, message, data: { userId, email, name, isAdmin, createdAt } }
        if (rsp.data.success) {
          setMember(rsp.data.data);
          setEditName(rsp.data.data.name);
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchMember();

    // 현재 로그인 유저와 같은지 비교
    if (loginUser && String(loginUser.userId) === String(userId)) {
      setIsCurrentUser(true);
    }
  }, [userId, loginUser]);

  // 회원 정보 수정
  const handleSubmit = async () => {
    try {
      const rsp = await AxiosApi.updateUser(
        userId,
        editName,
        editPassword || null   // 비밀번호 빈값이면 null 전달 → 변경 안 함
      );
      if (rsp.data.success) {
        const updated = rsp.data.data;
        setMember(updated);
        setEditMode(false);
        setEditPassword("");

        // 현재 유저 정보면 Context도 업데이트
        if (isCurrentUser) {
          setLoginUser({ ...loginUser, name: updated.name });
        }
        alert("수정이 완료되었습니다.");
      }
    } catch (e) {
      console.log(e);
      alert("수정에 실패했습니다.");
    }
  };

  if (!member) return <Container><p style={{color:"white"}}>로딩 중...</p></Container>;

  return (
    <Container>
      <UserInfo>
        <UserImagePlaceholder>👤</UserImagePlaceholder>
        {!editMode ? (
          <UserName>{member.name}</UserName>
        ) : (
          <StyledInput
            type="text"
            placeholder="이름을 입력하세요"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            style={{ marginLeft: "10px" }}
          />
        )}
      </UserInfo>

      {!editMode ? (
        <>
          <Field><Label>Email : {member.email}</Label></Field>
          <Field>
            <Label>
              가입일 : {Commons.formatDate(member.createdAt)}
            </Label>
          </Field>
          <Field>
            <Label>권한 : {member.isAdmin ? "👑 관리자" : "일반 회원"}</Label>
          </Field>
          {isCurrentUser && (
            <ButtonRow>
              <ActionButton onClick={() => setEditMode(true)}>편집</ActionButton>
              <ActionButton color="#e74c3c" onClick={() => navigate(-1)}>
                뒤로
              </ActionButton>
            </ButtonRow>
          )}
        </>
      ) : (
        <>
          <Field>
            <Label>새 비밀번호 (변경 시에만 입력)</Label>
            <StyledInput
              type="password"
              placeholder="비밀번호 (변경 안 하면 빈칸)"
              value={editPassword}
              onChange={(e) => setEditPassword(e.target.value)}
            />
          </Field>
          <ButtonRow>
            <ActionButton onClick={handleSubmit}>저장</ActionButton>
            <ActionButton color="#999" onClick={() => setEditMode(false)}>
              취소
            </ActionButton>
          </ButtonRow>
        </>
      )}
    </Container>
  );
};

export default MemberInfo;
