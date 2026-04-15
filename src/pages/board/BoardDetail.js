import { useState, useEffect, useContext } from "react";
import AxiosApi from "../../api/AxiosApi";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Commons from "../../utils/Commons";
import { UserContext } from "../../context/UserStore";

const Container = styled.div`
  padding: 20px;
  margin: 20px auto;
  max-width: 800px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 8px;
`;

const PostTitle = styled.h1`
  color: #333;
  font-size: 1.8em;
  margin-bottom: 8px;
`;

const PostMeta = styled.div`
  display: flex;
  justify-content: space-between;
  color: #888;
  font-size: 0.85em;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
`;

const PostContent = styled.p`
  color: #444;
  line-height: 1.8;
  white-space: pre-wrap;
  margin-bottom: 24px;
`;

const CategoryBadge = styled.span`
  font-size: 12px;
  background-color: #e3f2fd;
  color: #1565c0;
  padding: 3px 10px;
  border-radius: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  background-color: ${(props) => props.color || "#4caf50"};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  &:hover { opacity: 0.85; }
`;

const CommentSection = styled.div`
  margin-top: 24px;
  border-top: 2px solid #eee;
  padding-top: 16px;
`;

const CommentTitle = styled.h3`
  color: #555;
  margin-bottom: 16px;
`;

const CommentForm = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
`;

const CommentInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const CommentSubmitBtn = styled.button`
  padding: 10px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  &:hover { background-color: #0056b3; }
`;

const CommentList = styled.ul`
  list-style: none;
  padding: 0;
`;

const CommentItem = styled.li`
  padding: 12px 0;
  border-bottom: 1px solid #eee;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
`;

const CommentAuthor = styled.span`
  font-weight: bold;
  color: #333;
  font-size: 13px;
`;

const CommentDate = styled.span`
  color: #aaa;
  font-size: 12px;
`;

const CommentContent = styled.p`
  color: #444;
  margin: 0;
  font-size: 14px;
`;

const CommentActions = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 6px;
`;

const SmallButton = styled.button`
  padding: 3px 10px;
  font-size: 12px;
  background-color: ${(props) => props.color || "#6c757d"};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover { opacity: 0.85; }
`;

const EditCommentInput = styled.input`
  width: 100%;
  padding: 8px;
  margin: 6px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const BoardDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { loginUser } = useContext(UserContext);

  const [board, setBoard] = useState(null);
  const [comments, setComments] = useState([]);
  const [inputComment, setInputComment] = useState("");
  const [showComments, setShowComments] = useState(true);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState("");

  // ✅ Hook은 조건문보다 반드시 먼저 선언
  useEffect(() => {
    if (!loginUser) {
      navigate("/");
      return;
    }
    loadBoardDetail();
  }, [postId, loginUser]);

  const loadBoardDetail = async () => {
    try {
      const rsp1 = await AxiosApi.getPost(postId);
      if (rsp1.data.success) setBoard(rsp1.data.data);

      const rsp2 = await AxiosApi.getCommentList(postId);
      if (rsp2.data.success) setComments(rsp2.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  const refreshComments = async () => {
    try {
      const rsp = await AxiosApi.getCommentList(postId);
      if (rsp.data.success) setComments(rsp.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleDeleteBoard = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      const rsp = await AxiosApi.deletePost(postId, loginUser.userId);
      if (rsp.data.success) {
        alert("게시글이 삭제되었습니다.");
        navigate("/boards");
      } else {
        alert(rsp.data.message || "삭제에 실패했습니다.");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmitComment = async () => {
    if (!inputComment.trim()) return;
    try {
      const rsp = await AxiosApi.writeComment(postId, loginUser.userId, inputComment);
      if (rsp.data.success) {
        setInputComment("");
        refreshComments();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleEditComment = (comment) => {
    setEditCommentId(comment.commentId);
    setEditCommentContent(comment.content);
  };

  const handleUpdateComment = async (commentId) => {
    try {
      const rsp = await AxiosApi.updateComment(
        postId, commentId, loginUser.userId, editCommentContent
      );
      if (rsp.data.success) {
        setEditCommentId(null);
        setEditCommentContent("");
        refreshComments();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
    try {
      const rsp = await AxiosApi.deleteComment(postId, commentId, loginUser.userId);
      if (rsp.data.success) refreshComments();
    } catch (e) {
      console.log(e);
    }
  };

  // ✅ 조기 리턴은 모든 Hook 선언 이후에
  if (!loginUser) return null;
  if (!board) return <Container><p>로딩 중...</p></Container>;

  return (
    <Container>
      <PostTitle>{board.title}</PostTitle>
      <PostMeta>
        <span>✍ {board.userName} &nbsp;|&nbsp; {Commons.timeFromNow(board.createdAt)}</span>
        <div>{board.category && <CategoryBadge>{board.category}</CategoryBadge>}</div>
      </PostMeta>
      <PostContent>{board.content}</PostContent>

      <ButtonContainer>
        <ActionButton color="#6c757d" onClick={() => navigate("/boards")}>
          목록
        </ActionButton>
        {loginUser.userId === board.userId && (
          <ActionButton color="#e74c3c" onClick={handleDeleteBoard}>
            삭제
          </ActionButton>
        )}
      </ButtonContainer>

      <CommentSection>
        <CommentTitle>
          💬 댓글 {comments.length}개
          <ActionButton
            style={{ marginLeft: "12px", fontSize: "12px", padding: "4px 10px" }}
            color="#aaa"
            onClick={() => setShowComments(!showComments)}
          >
            {showComments ? "숨기기" : "보기"}
          </ActionButton>
        </CommentTitle>

        <CommentForm>
          <CommentInput
            type="text"
            placeholder="댓글을 입력하세요..."
            value={inputComment}
            onChange={(e) => setInputComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmitComment()}
          />
          <CommentSubmitBtn onClick={handleSubmitComment}>등록</CommentSubmitBtn>
        </CommentForm>

        {showComments && (
          <CommentList>
            {comments.length === 0 ? (
              <p style={{ color: "#aaa", textAlign: "center" }}>첫 댓글을 남겨보세요!</p>
            ) : (
              comments.map((comment) => (
                <CommentItem key={comment.commentId}>
                  <CommentHeader>
                    <CommentAuthor>👤 {comment.userName}</CommentAuthor>
                    <CommentDate>{Commons.timeFromNow(comment.createdAt)}</CommentDate>
                  </CommentHeader>

                  {editCommentId === comment.commentId ? (
                    <>
                      <EditCommentInput
                        value={editCommentContent}
                        onChange={(e) => setEditCommentContent(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleUpdateComment(comment.commentId)}
                      />
                      <CommentActions>
                        <SmallButton color="#4caf50" onClick={() => handleUpdateComment(comment.commentId)}>저장</SmallButton>
                        <SmallButton color="#aaa" onClick={() => setEditCommentId(null)}>취소</SmallButton>
                      </CommentActions>
                    </>
                  ) : (
                    <>
                      <CommentContent>{comment.content}</CommentContent>
                      {loginUser.userId === comment.userId && (
                        <CommentActions>
                          <SmallButton color="#1da1f2" onClick={() => handleEditComment(comment)}>수정</SmallButton>
                          <SmallButton color="#e74c3c" onClick={() => handleDeleteComment(comment.commentId)}>삭제</SmallButton>
                        </CommentActions>
                      )}
                    </>
                  )}
                </CommentItem>
              ))
            )}
          </CommentList>
        )}
      </CommentSection>
    </Container>
  );
};

export default BoardDetail;
