import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineClockCircle,
  AiOutlineMessage,
} from "react-icons/ai";
import { FiEye } from "react-icons/fi";
import { IoArrowBack } from "react-icons/io5";
import { MdEdit, MdDelete, MdCheck, MdClose } from "react-icons/md";
import AxiosApi from "../api/AxiosApi";
import { UserContext } from "../context/UserStore";

const COLORS = {
  text: "#1A1A1A",
  primary: "#1D6BF3",
  white: "#FFFFFF",
  bg: "#F5F5F5",
  border: "#E1E1E1",
  inputBg: "#EEEEEE",
  gray: "#999999",
  danger: "#E53E3E",
};

const categoryMap = {
  FREE: "자유게시판",
  QNA: "질문 / 답변",
  INFO: "정보게시판",
};

const formatRelativeDate = (value) => {
  const date = new Date(value);
  const now = new Date();
  if (Number.isNaN(date.getTime())) return value;
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / (1000 * 60));
  const diffHour = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDay = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffMin < 1) return "방금 전";
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay === 1) return "어제";
  if (diffDay < 7) return `${diffDay}일 전`;
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
};

const PostDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { loginUser } = useContext(UserContext);

  const [post, setPost] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // ─── 게시글 수정 state ───
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editSaving, setEditSaving] = useState(false);
  const [postEdited, setPostEdited] = useState(false);

  // ─── 댓글 수정 state ───
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState("");
  const [commentSaving, setCommentSaving] = useState(false);

  // 게시글 조회
  useEffect(() => {
    if (!loginUser) return;
    const fetchPost = async () => {
      try {
        const rsp = await AxiosApi.getPost(postId);
        if (rsp.data.success) {
          setPost(rsp.data.data);
          setLikeCount(rsp.data.data.likeCount || 0);
        }
      } catch (e) {
        console.error("게시글 조회 실패:", e);
      }
    };
    fetchPost();
  }, [postId]);

  // 댓글 목록 조회
  const fetchComments = async () => {
    try {
      const rsp = await AxiosApi.getCommentList(postId);
      if (rsp.data.success) setComments(rsp.data.data || []);
    } catch (e) {
      console.error("댓글 조회 실패:", e);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  // 좋아요 여부 확인
  useEffect(() => {
    if (!loginUser) return;
    const check = async () => {
      try {
        const rsp = await AxiosApi.isLiked(postId, loginUser.userId);
        if (rsp.data.success) setLiked(rsp.data.data);
      } catch (e) {
        console.error("좋아요 여부 확인 실패:", e);
      }
    };
    check();
  }, [postId, loginUser]);

  if (!post) return <LoadingPage>게시글을 불러오는 중입니다...</LoadingPage>;

  // 작성자 본인 또는 관리자 여부 (수정은 본인만, 삭제는 본인+관리자)
  const isAuthor = loginUser && loginUser.userId === post.userId;
  const canDelete =
    loginUser && (loginUser.userId === post.userId || loginUser.isAdmin);

  // ─── 좋아요 토글 ───
  const onClickLike = async () => {
    if (!loginUser) {
      alert("로그인이 필요합니다.");
      return;
    }
    try {
      const rsp = await AxiosApi.toggleLike(postId, loginUser.userId);
      if (rsp.data.success) {
        setLiked(rsp.data.data.liked);
        setLikeCount(rsp.data.data.likeCount);
      }
    } catch (e) {
      console.error("좋아요 실패:", e);
    }
  };

  // ─── 게시글 수정 ───
  const onClickEdit = () => {
    setEditTitle(post.title);
    setEditContent(post.content);
    setIsEditing(true);
  };

  const onClickEditCancel = () => {
    setIsEditing(false);
    setEditTitle("");
    setEditContent("");
  };

  const onClickEditSave = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }
    setEditSaving(true);
    try {
      const rsp = await AxiosApi.updatePost(
        postId,
        loginUser.userId,
        editTitle.trim(),
        editContent.trim(),
        post.category,
      );
      if (rsp.data.success) {
        setPost((prev) => ({
          ...prev,
          title: editTitle.trim(),
          content: editContent.trim(),
        }));
        setPostEdited(true);
        setIsEditing(false);
      }
    } catch (e) {
      console.error("게시글 수정 실패:", e);
      alert("수정에 실패했습니다.");
    } finally {
      setEditSaving(false);
    }
  };

  // ─── 게시글 삭제 ───
  const onClickDelete = async () => {
    if (!window.confirm("게시글을 삭제하시겠습니까?")) return;
    try {
      const rsp = await AxiosApi.deletePost(postId, loginUser.userId);
      if (rsp.data.success) {
        alert("게시글이 삭제되었습니다.");
        navigate(-1);
      }
    } catch (e) {
      console.error("게시글 삭제 실패:", e);
      alert("삭제에 실패했습니다.");
    }
  };

  // ─── 댓글 등록 ───
  const onClickCommentSubmit = async () => {
    if (!loginUser) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!commentInput.trim()) return;
    setSubmitting(true);
    try {
      const rsp = await AxiosApi.writeComment(
        postId,
        loginUser.userId,
        commentInput.trim(),
      );
      if (rsp.data.success) {
        await fetchComments();
        setCommentInput("");
      }
    } catch (e) {
      console.error("댓글 등록 실패:", e);
      alert("댓글 등록에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const onKeyDownComment = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onClickCommentSubmit();
    }
  };

  // ─── 댓글 수정 ───
  const onClickCommentEdit = (comment) => {
    setEditingCommentId(comment.commentId);
    setEditCommentContent(comment.content);
  };

  const onClickCommentEditCancel = () => {
    setEditingCommentId(null);
    setEditCommentContent("");
  };

  const onClickCommentEditSave = async (commentId) => {
    if (!editCommentContent.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }
    setCommentSaving(true);
    try {
      const rsp = await AxiosApi.updateComment(
        postId,
        commentId,
        loginUser.userId,
        editCommentContent.trim(),
      );
      if (rsp.data.success) {
        await fetchComments();
        setEditingCommentId(null);
        setEditCommentContent("");
      }
    } catch (e) {
      console.error("댓글 수정 실패:", e);
      alert("댓글 수정에 실패했습니다.");
    } finally {
      setCommentSaving(false);
    }
  };

  // ─── 댓글 삭제 ───
  const onClickCommentDelete = async (commentId) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
    try {
      const rsp = await AxiosApi.deleteComment(
        postId,
        commentId,
        loginUser.userId,
      );
      if (rsp.data.success) await fetchComments();
    } catch (e) {
      console.error("댓글 삭제 실패:", e);
      alert("댓글 삭제에 실패했습니다.");
    }
  };

  return (
    <Page>
      <Container>
        <PostSection>
          <BackButton onClick={() => navigate(-1)}>
            <IoArrowBack size={20} />
            <span>목록으로</span>
          </BackButton>

          <CategoryBadge>
            {categoryMap[post.category] || post.category}
          </CategoryBadge>

          {/* 제목 (수정 모드 / 일반 모드) */}
          {isEditing ? (
            <EditTitleInput
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              maxLength={100}
            />
          ) : (
            <TitleRow>
              <Title>{post.title}</Title>
              {/* 수정: 본인만 / 삭제: 본인 + 관리자 */}
              {(isAuthor || canDelete) && (
                <AuthorActions>
                  {isAuthor && (
                    <ActionBtn onClick={onClickEdit} title="수정">
                      <MdEdit size={18} />
                      수정
                    </ActionBtn>
                  )}
                  {canDelete && (
                    <ActionBtn $danger onClick={onClickDelete} title="삭제">
                      <MdDelete size={18} />
                      삭제
                    </ActionBtn>
                  )}
                </AuthorActions>
              )}
            </TitleRow>
          )}

          <AuthorRow>
            {post.companyName || "무소속"} · {post.maskedEmail}
          </AuthorRow>

          <InfoRow>
            <InfoItem>
              <AiOutlineClockCircle size={14} />
              <span>{formatRelativeDate(post.createdAt)}</span>
              {postEdited && <EditedBadge>수정됨</EditedBadge>}
            </InfoItem>
            <InfoItem>
              <FiEye size={14} />
              <span>{post.viewCount}</span>
            </InfoItem>
            <InfoItem>
              <AiOutlineMessage size={14} />
              <span>{comments.length}</span>
            </InfoItem>
          </InfoRow>

          <Divider />

          {/* 본문 (수정 모드 / 일반 모드) */}
          {isEditing ? (
            <>
              <EditContentTextarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="내용을 입력하세요"
              />
              <EditActionRow>
                <EditCancelBtn
                  onClick={onClickEditCancel}
                  disabled={editSaving}
                >
                  <MdClose size={16} />
                  취소
                </EditCancelBtn>
                <EditSaveBtn onClick={onClickEditSave} disabled={editSaving}>
                  <MdCheck size={16} />
                  {editSaving ? "저장 중..." : "저장"}
                </EditSaveBtn>
              </EditActionRow>
            </>
          ) : (
            <Content>{post.content}</Content>
          )}

          <BottomRow>
            <LikeBox onClick={onClickLike}>
              {liked ? (
                <AiFillHeart size={22} color={COLORS.primary} />
              ) : (
                <AiOutlineHeart size={22} color={COLORS.text} />
              )}
              <LikeCount>{likeCount}</LikeCount>
            </LikeBox>
          </BottomRow>
        </PostSection>

        {/* 댓글 섹션 */}
        <CommentSection>
          <CommentTitle>댓글 {comments.length}</CommentTitle>

          <CommentInputContainer>
            <CommentInputWrap>
              <CommentInputInner>
                <InputIcon>
                  <AiOutlineMessage size={22} />
                </InputIcon>
                <CommentInput
                  placeholder={
                    loginUser
                      ? "댓글을 남겨주세요."
                      : "로그인 후 댓글을 작성할 수 있습니다."
                  }
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  onKeyDown={onKeyDownComment}
                  disabled={!loginUser || submitting}
                />
              </CommentInputInner>
            </CommentInputWrap>
            <SubmitButton
              onClick={onClickCommentSubmit}
              disabled={!loginUser || submitting}
            >
              {submitting ? "등록 중" : "등록"}
            </SubmitButton>
          </CommentInputContainer>

          <CommentList>
            {comments.map((comment) => {
              const isCommentAuthor =
                loginUser && loginUser.userId === comment.userId;
              const isEditingThis = editingCommentId === comment.commentId;

              return (
                <CommentItem key={comment.commentId}>
                  <CommentHeader>
                    <CommentAuthor>
                      <CompanyName>
                        {comment.companyName || "무소속"}
                      </CompanyName>
                      <MaskedId>
                        {" "}
                        · {comment.maskedEmail || comment.userName}
                      </MaskedId>
                    </CommentAuthor>

                    {isCommentAuthor && !isEditingThis && (
                      <CommentActions>
                        <CommentActionBtn
                          onClick={() => onClickCommentEdit(comment)}
                          title="수정"
                        >
                          <MdEdit size={14} />
                          수정
                        </CommentActionBtn>
                        <CommentActionBtn
                          $danger
                          onClick={() =>
                            onClickCommentDelete(comment.commentId)
                          }
                          title="삭제"
                        >
                          <MdDelete size={14} />
                          삭제
                        </CommentActionBtn>
                      </CommentActions>
                    )}
                  </CommentHeader>

                  {isEditingThis ? (
                    <CommentEditBox>
                      <CommentEditTextarea
                        value={editCommentContent}
                        onChange={(e) => setEditCommentContent(e.target.value)}
                        disabled={commentSaving}
                      />
                      <CommentEditActions>
                        <EditCancelBtn
                          onClick={onClickCommentEditCancel}
                          disabled={commentSaving}
                        >
                          <MdClose size={14} />
                          취소
                        </EditCancelBtn>
                        <EditSaveBtn
                          onClick={() =>
                            onClickCommentEditSave(comment.commentId)
                          }
                          disabled={commentSaving}
                        >
                          <MdCheck size={14} />
                          {commentSaving ? "저장 중..." : "저장"}
                        </EditSaveBtn>
                      </CommentEditActions>
                    </CommentEditBox>
                  ) : (
                    <CommentText>{comment.content}</CommentText>
                  )}

                  <CommentMetaRow>
                    <CommentMeta>
                      <AiOutlineClockCircle size={13} />
                      <span>{formatRelativeDate(comment.createdAt)}</span>
                    </CommentMeta>
                  </CommentMetaRow>
                </CommentItem>
              );
            })}
          </CommentList>
        </CommentSection>
      </Container>
    </Page>
  );
};

export default PostDetailPage;

// ─── 스타일 ──────────────────────────────────────────────────
const LoadingPage = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${COLORS.bg};
  color: ${COLORS.gray};
  font-size: 14px;
`;
const Page = styled.div`
  min-height: 100vh;
  background: ${COLORS.bg};
`;
const Container = styled.div`
  max-width: 760px;
  margin: 0 auto;
  padding: 28px 20px 60px;
`;
const PostSection = styled.div`
  background: ${COLORS.bg};
`;
const BackButton = styled.button`
  display: flex;
  gap: 6px;
  align-items: center;
  margin: 30px 0;
  border: none;
  background: transparent;
  color: ${COLORS.gray};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }
`;
const CategoryBadge = styled.div`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  background: rgba(29, 107, 243, 0.1);
  color: ${COLORS.primary};
  font-size: 12px;
  font-weight: 600;
`;
const TitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin: 10px 0 18px;
`;
const Title = styled.h1`
  font-size: 23px;
  font-weight: 800;
  line-height: 1.25;
  color: ${COLORS.text};
  flex: 1;
  margin: 0;
`;
const AuthorActions = styled.div`
  display: flex;
  gap: 6px;
  flex-shrink: 0;
  margin-top: 4px;
`;
const ActionBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid ${(p) => (p.$danger ? COLORS.danger : COLORS.border)};
  background: ${COLORS.white};
  color: ${(p) => (p.$danger ? COLORS.danger : COLORS.gray)};
  transition:
    background 0.15s,
    color 0.15s;
  &:hover {
    background: ${(p) => (p.$danger ? COLORS.danger : COLORS.primary)};
    color: ${COLORS.white};
    border-color: ${(p) => (p.$danger ? COLORS.danger : COLORS.primary)};
  }
`;
const EditTitleInput = styled.input`
  width: 100%;
  font-size: 20px;
  font-weight: 700;
  color: ${COLORS.text};
  border: 1px solid ${COLORS.primary};
  border-radius: 6px;
  padding: 10px 14px;
  margin: 10px 0 18px;
  outline: none;
  background: ${COLORS.white};
  box-sizing: border-box;
`;
const EditContentTextarea = styled.textarea`
  width: 100%;
  min-height: 260px;
  font-size: 15px;
  line-height: 1.7;
  color: ${COLORS.text};
  border: 1px solid ${COLORS.primary};
  border-radius: 6px;
  padding: 14px;
  outline: none;
  resize: vertical;
  background: ${COLORS.white};
  box-sizing: border-box;
  margin-bottom: 14px;
`;
const EditActionRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 60px;
`;
const EditCancelBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 16px;
  border-radius: 6px;
  border: 1px solid ${COLORS.border};
  background: ${COLORS.white};
  color: ${COLORS.gray};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  &:hover:not(:disabled) {
    background: ${COLORS.bg};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
const EditSaveBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 16px;
  border-radius: 6px;
  border: none;
  background: ${COLORS.primary};
  color: ${COLORS.white};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  &:hover:not(:disabled) {
    background: #1558d0;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
const AuthorRow = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: ${COLORS.text};
  margin-bottom: 12px;
`;
const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  color: ${COLORS.gray};
  font-size: 14px;
  margin-bottom: 24px;
`;
const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;
const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: ${COLORS.border};
  margin-bottom: 36px;
`;
const Content = styled.div`
  font-size: 15px;
  line-height: 1.7;
  color: ${COLORS.text};
  white-space: pre-wrap;
  margin-bottom: 60px;
`;
const BottomRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 44px;
`;
const LikeBox = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1px solid ${COLORS.border};
  border-radius: 20px;
  padding: 8px 20px;
  background: transparent;
  cursor: pointer;
`;
const LikeCount = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: ${COLORS.text};
`;
const CommentSection = styled.div`
  border-top: 1px solid ${COLORS.border};
  padding-top: 18px;
`;
const CommentTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: ${COLORS.text};
  margin: 0 0 18px;
`;
const CommentInputContainer = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 16px;
`;
const CommentInputWrap = styled.div`
  flex: 1;
  border: 1px solid ${COLORS.border};
  background: ${COLORS.white};
  height: 70px;
  display: flex;
  align-items: center;
`;
const CommentInputInner = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0 20px;
`;
const InputIcon = styled.div`
  display: flex;
  align-items: center;
  color: #666666;
  margin-right: 12px;
`;
const CommentInput = styled.input`
  border: none;
  outline: none;
  width: 100%;
  font-size: 15px;
  color: ${COLORS.text};
  background: transparent;
  &::placeholder {
    color: ${COLORS.gray};
  }
  &:disabled {
    cursor: not-allowed;
  }
`;
const SubmitButton = styled.button`
  border: none;
  background: ${(p) => (p.disabled ? "#cccccc" : COLORS.primary)};
  color: ${COLORS.white};
  font-size: 15px;
  font-weight: 500;
  cursor: ${(p) => (p.disabled ? "not-allowed" : "pointer")};
  height: 70px;
  width: 80px;
  &:hover:not(:disabled) {
    background: #1558d0;
  }
`;
const CommentList = styled.div`
  display: flex;
  flex-direction: column;
`;
const CommentItem = styled.div`
  padding: 18px;
  border-bottom: 1px solid ${COLORS.border};
`;
const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;
const CommentAuthor = styled.div`
  display: flex;
  align-items: center;
`;
const CommentActions = styled.div`
  display: flex;
  gap: 4px;
`;
const CommentActionBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 3px 10px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid ${(p) => (p.$danger ? COLORS.danger : COLORS.border)};
  background: ${COLORS.white};
  color: ${(p) => (p.$danger ? COLORS.danger : COLORS.gray)};
  transition:
    background 0.15s,
    color 0.15s;
  &:hover {
    background: ${(p) => (p.$danger ? COLORS.danger : COLORS.primary)};
    color: ${COLORS.white};
    border-color: ${(p) => (p.$danger ? COLORS.danger : COLORS.primary)};
  }
`;
const CommentEditBox = styled.div`
  margin-bottom: 8px;
`;
const CommentEditTextarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  font-size: 14px;
  line-height: 1.6;
  color: ${COLORS.text};
  border: 1px solid ${COLORS.primary};
  border-radius: 6px;
  padding: 10px 12px;
  outline: none;
  resize: vertical;
  background: ${COLORS.white};
  box-sizing: border-box;
  margin-bottom: 8px;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
const CommentEditActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 6px;
`;
const CompanyName = styled.span`
  color: ${COLORS.primary};
  font-weight: 500;
  font-size: 14px;
`;
const MaskedId = styled.span`
  color: ${COLORS.gray};
  font-size: 14px;
`;
const CommentText = styled.div`
  font-size: 15px;
  line-height: 1.55;
  color: ${COLORS.text};
  margin-bottom: 10px;
`;
const CommentMetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  color: ${COLORS.gray};
  font-size: 13px;
`;
const CommentMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;
const EditedBadge = styled.span`
  font-size: 11px;
  color: ${COLORS.gray};
  background: ${COLORS.border};
  padding: 1px 7px;
  border-radius: 999px;
  margin-left: 4px;
`;
