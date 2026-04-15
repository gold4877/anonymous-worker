import React, { useState, useEffect, useContext } from "react";
import AxiosApi from "../../api/AxiosApi";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import BoardList from "./BoardList";
import { UserContext } from "../../context/UserStore";

const BoardContainer = styled.div`
  padding: 0 30px;
  position: relative;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  color: #333;
  text-align: center;
`;

const CircleFixedButton = styled.button`
  position: fixed;
  bottom: 24px;
  right: 30px;
  z-index: 10;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1da1f2;
  color: white;
  font-size: 30px;
  line-height: 1;
  box-shadow: 1px 4px 8px rgba(0, 0, 0, 0.4);
  border: none;
  cursor: pointer;
  outline: none;
  &:hover { background-color: #1991db; }
  &:before { content: "+"; }
`;

const SearchBar = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const SearchButton = styled.button`
  padding: 10px 16px;
  background-color: #1da1f2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover { background-color: #1991db; }
`;

const Boards = () => {
  const [boardList, setBoardList] = useState([]);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const { loginUser } = useContext(UserContext);

  // ✅ Hook은 조건문/조기 리턴보다 반드시 먼저 선언해야 함
  useEffect(() => {
    if (!loginUser) {
      navigate("/");
      return;
    }
    loadBoardList();
  }, [loginUser]);

  const loadBoardList = async () => {
    try {
      const rsp = await AxiosApi.getPostList();
      if (rsp.data.success) {
        setBoardList(rsp.data.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleSearch = async () => {
    if (!keyword.trim()) {
      loadBoardList();
      return;
    }
    try {
      const rsp = await AxiosApi.searchPost(keyword);
      if (rsp.data.success) {
        setBoardList(rsp.data.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleWriteClick = () => navigate("/boardWrite");
  const handleDetailClick = (postId) => navigate(`/boardDetail/${postId}`);

  if (!loginUser) return null;

  return (
    <BoardContainer>
      <Title>게시판 목록</Title>

      <SearchBar>
        <SearchInput
          placeholder="제목 검색..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <SearchButton onClick={handleSearch}>검색</SearchButton>
        <SearchButton
          style={{ backgroundColor: "#aaa" }}
          onClick={() => { setKeyword(""); loadBoardList(); }}
        >
          전체
        </SearchButton>
      </SearchBar>

      <BoardList boardList={boardList} handleDetailClick={handleDetailClick} />
      <CircleFixedButton onClick={handleWriteClick} />
    </BoardContainer>
  );
};

export default Boards;
