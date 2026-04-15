import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AxiosApi from "../../api/AxiosApi";
import styled from "styled-components";
import Modal from "../../component/Modal";
import { UserContext } from "../../context/UserStore";

const FormContainer = styled.div`
  padding: 20px;
  margin: auto;
  max-width: 600px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: white;
`;

const Title = styled.h1`
  color: #333;
  text-align: center;
`;

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const StyledLabel = styled.label`
  font-weight: bold;
  margin-bottom: 6px;
  color: #555;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  height: 150px;
  resize: vertical;
  box-sizing: border-box;
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  background-color: white;
  cursor: pointer;
  &:focus { outline: none; border-color: #4caf50; }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 10px;
`;

const SubmitButton = styled.button`
  padding: 10px 24px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  &:hover { background-color: #45a049; }
`;

const CancelButton = styled.button`
  padding: 10px 24px;
  background-color: #aaa;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  &:hover { background-color: #888; }
`;

// 카테고리 옵션 (각 조에서 수정 가능)
const CATEGORIES = [
  { value: "", label: "카테고리 없음" },
  { value: "자유", label: "자유게시판" },
  { value: "후기", label: "후기" },
  { value: "정보", label: "정보" },
  { value: "질문", label: "질문" },
];

const BoardWrite = () => {
  const navigate = useNavigate();
  const { loginUser } = useContext(UserContext);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [modalContent, setModalContent] = useState("");
  const [modalHeader, setModalHeader] = useState("실패");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(false);

  // ✅ Hook은 반드시 조건부 return 전에 선언
  useEffect(() => {
    if (!loginUser) {
      navigate("/");
    }
  }, [loginUser, navigate]);

  const closeModal = () => setModalOpen(false);
  const confirmModal = () => navigate("/boards");

  if (!loginUser) return null;

  const handleSubmit = async () => {
    if (!title.trim()) { alert("제목을 입력해주세요."); return; }
    if (!content.trim()) { alert("내용을 입력해주세요."); return; }
    try {
      const rsp = await AxiosApi.writePost(
        loginUser.userId,
        title,
        content,
        category || null
      );
      if (rsp.data.success) {
        setModalHeader("성공");
        setModalContent("게시글이 등록되었습니다.");
        setModalType(true);
        setModalOpen(true);
      } else {
        setModalHeader("실패");
        setModalContent(rsp.data.message || "게시글 등록에 실패했습니다.");
        setModalType(false);
        setModalOpen(true);
      }
    } catch (e) {
      console.log(e);
      setModalHeader("오류");
      setModalContent("서버 오류가 발생했습니다.");
      setModalOpen(true);
    }
  };

  const handleReset = () => {
    setTitle("");
    setContent("");
    setCategory("");
    navigate("/boards");
  };

  return (
    <FormContainer>
      <Title>글쓰기</Title>

      <FieldContainer>
        <StyledLabel>카테고리</StyledLabel>
        <StyledSelect
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </StyledSelect>
      </FieldContainer>

      <FieldContainer>
        <StyledLabel>제목 *</StyledLabel>
        <StyledInput
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </FieldContainer>

      <FieldContainer>
        <StyledLabel>내용 *</StyledLabel>
        <StyledTextarea
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </FieldContainer>

      <ButtonContainer>
        <SubmitButton onClick={handleSubmit}>글쓰기</SubmitButton>
        <CancelButton onClick={handleReset}>취소</CancelButton>
      </ButtonContainer>

      <Modal
        open={modalOpen}
        close={closeModal}
        header={modalHeader}
        type={modalType}
        confirm={confirmModal}
      >
        {modalContent}
      </Modal>
    </FormContainer>
  );
};

export default BoardWrite;
