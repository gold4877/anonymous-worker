import React from "react";
import styled from "styled-components";
import Commons from "../../utils/Commons";

const BoardLi = styled.li`
  background-color: #f2f2f2;
  margin: 10px 0;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: #e8e8e8;
  }
`;

const BoardContentWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  padding-top: 4px;
`;

const BoardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
`;

const BoardTitle = styled.h2`
  font-size: 1.2em;
  color: #007bff;
  margin: 0;
`;

const BoardMeta = styled.span`
  color: #555;
  font-style: italic;
  font-size: 13px;
`;

const BoardContent = styled.p`
  color: #444;
  font-size: 0.95em;
  margin: 4px 0;
  /* 긴 내용은 2줄까지만 표시 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const BoardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
`;

const BoardDate = styled.p`
  color: #777;
  font-size: 0.8em;
  margin: 0;
`;

const CategoryBadge = styled.span`
  font-size: 11px;
  background-color: #e3f2fd;
  color: #1565c0;
  padding: 2px 8px;
  border-radius: 10px;
`;

const BoardListItem = ({ board, handleDetailClick }) => {
  return (
    <BoardLi onClick={() => handleDetailClick(board.postId)}>
      <BoardContentWrapper>
        <BoardHeader>
          <BoardTitle>{board.title}</BoardTitle>
          <BoardMeta>✍ {board.userName}</BoardMeta>
        </BoardHeader>
        <BoardContent>{board.content}</BoardContent>
        <BoardFooter>
          <BoardDate>{Commons.timeFromNow(board.createdAt)}</BoardDate>
          {board.category && (
            <CategoryBadge>{board.category}</CategoryBadge>
          )}
        </BoardFooter>
      </BoardContentWrapper>
    </BoardLi>
  );
};

export default BoardListItem;
