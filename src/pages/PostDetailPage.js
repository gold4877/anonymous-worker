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
import AxiosApi from "../api/AxiosApi";
import { UserContext } from "../context/UserStore";

const COLORS = {
  text: "#1A1A1A",
  primary: "#1D6BF3",
  white: "#FFFFFF",
  bg: "#F5F5F5",
  border: "#E1E1E1",
  gray: "#999999",
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

  // 게시글 조회
  useEffect(() => {
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

  // 좋아요 토글
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

  // 댓글 등록
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
          <Title>{post.title}</Title>
          <AuthorRow>
            {post.companyName || "무소속"} · {post.maskedEmail}
          </AuthorRow>

          <InfoRow>
            <InfoItem>
              <AiOutlineClockCircle size={14} />
              <span>{formatRelativeDate(post.createdAt)}</span>
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
          <Content>{post.content}</Content>

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
            {comments.map((comment) => (
              <CommentItem key={comment.commentId}>
                <CommentAuthor>
                  {/* 회사명 있으면 파랑, 없으면 무소속 */}
                  <CompanyName>{comment.companyName || "무소속"}</CompanyName>
                  {/* maskedEmail 있으면 표시, 없으면 userName */}
                  <MaskedId>
                    {" "}
                    · {comment.maskedEmail || comment.userName}
                  </MaskedId>
                </CommentAuthor>
                <CommentText>{comment.content}</CommentText>
                <CommentMetaRow>
                  <CommentMeta>
                    <AiOutlineClockCircle size={13} />
                    <span>{formatRelativeDate(comment.createdAt)}</span>
                  </CommentMeta>
                </CommentMetaRow>
              </CommentItem>
            ))}
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
  color: #999999;
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
  color: #1d6bf3;
  font-size: 12px;
  font-weight: 600;
`;
const Title = styled.h1`
  font-size: 23px;
  font-weight: 800;
  line-height: 1.25;
  color: ${COLORS.text};
  margin: 10px 0 18px;
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
    color: #999999;
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
const CommentAuthor = styled.div`
  margin-bottom: 8px;
`;
const CompanyName = styled.span`
  color: #1d6bf3;
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
