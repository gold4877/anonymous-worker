import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { AiFillHeart, AiOutlineHeart, AiOutlineClockCircle, AiOutlineMessage } from "react-icons/ai";
import { FiEye } from "react-icons/fi";
import { IoArrowBack } from "react-icons/io5";

const COLORS = {
  text: "#1A1A1A",
  primary: "#1D6BF3",
  white: "#FFFFFF",
  bg: "#F5F5F5",
  inputBg: "#EEEEEE",
  border: "#E1E1E1",
  gray: "#999999",
};

const dummyPosts = [
  {
    postId: 1,
    title: "출근 5분 전에 일어나는 사람 있음?",
    maskedEmail: "i*****",
    companyName: "카카오",
    category: "FREE",
    content:
      "진짜 눈 뜨면 출근까지 10분 남아있음\n세수만 하고 바로 나가는데\n이거 언제까지 가능할까...",
    viewCount: 128,
    likeCount: 11,
    createdAt: "2026-04-09T10:00:00",
  },
];

const dummyComments = [
  {
    commentId: 1,
    maskedEmail: "s******",
    companyName: "CJ대한통운",
    content: "나도 맨날 이럼 ㅋㅋㅋ 알람 의미 없음",
    likeCount: 2,
    createdAt: "2026-04-08T11:00:00",
  },
  {
    commentId: 2,
    maskedEmail: "i******",
    companyName: "LG유플러스",
    content: "근데 또 이렇게 살아도 잘 돌아가긴 함...",
    likeCount: 1,
    createdAt: "2026-04-08T12:00:00",
  },
];

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

  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}.${String(date.getDate()).padStart(2, "0")}`;
};

const getAuthorText = (companyName, maskedEmail) => {
  return `${companyName || "무소속"} · ${maskedEmail}`;
};

const PostDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const post = useMemo(() => {
    return dummyPosts.find((item) => String(item.postId) === String(postId)) || dummyPosts[0];
  }, [postId]);

  const [liked, setLiked] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState(
    dummyComments.map((c) => ({ ...c, liked: false }))
  );

  const displayLikeCount = post.likeCount + (liked ? 1 : 0);

  const onClickLike = () => {
    setLiked((prev) => !prev);
  };

  const onClickCommentLike = (id) => {
    setComments((prev) =>
      prev.map((c) =>
        c.commentId === id
          ? {
              ...c,
              liked: !c.liked,
              likeCount: c.liked ? c.likeCount - 1 : c.likeCount + 1,
            }
          : c,
      ),
    );
  };

  const onClickCommentSubmit = () => {
    if (!commentInput.trim()) return;

    const newComment = {
      commentId: Date.now(),
      maskedEmail: "m******",
      companyName: "NARAE",
      content: commentInput.trim(),
      likeCount: 0,
      createdAt: new Date().toISOString(),
    };

    setComments((prev) => [newComment, ...prev]);
    setCommentInput("");
  };

  return (
    <Page>
      <Container>
        <PostSection>
          <TopRow>
            <BackButton onClick={() => navigate(-1)}>
              <IoArrowBack size={20} />
              <span>목록으로</span>
            </BackButton>
          </TopRow>
          <Title>{post.title}</Title>

          <AuthorRow>{getAuthorText(post.companyName, post.maskedEmail)}</AuthorRow>

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
              <LikeCount>{displayLikeCount}</LikeCount>
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
                  placeholder="댓글을 남겨주세요."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                />
              </CommentInputInner>
            </CommentInputWrap>

            <CommentSubmitRow>
              <SubmitButton onClick={onClickCommentSubmit}>등록</SubmitButton>
            </CommentSubmitRow>
          </CommentInputContainer>
          

          <CommentList>
            {comments.map((comment) => {
              const isLiked = comment.liked ?? false;

              return (
                <CommentItem key={comment.commentId}>
                  <CommentAuthor>
                    <CompanyName>{comment.companyName}</CompanyName>
                    <MaskedId> · {comment.maskedEmail}</MaskedId>
                  </CommentAuthor>

                  <CommentText>{comment.content}</CommentText>

                  <CommentMetaRow>
                    <CommentMeta>
                      <AiOutlineClockCircle size={13} />
                      <span>{formatRelativeDate(comment.createdAt)}</span>
                    </CommentMeta>

                    <CommentMeta
                      style={{ cursor: "pointer" }}
                      onClick={() => onClickCommentLike(comment.commentId)}
                    >
                      {isLiked ? ( 
                        <AiFillHeart size={13} color="#1D6BF3" />
                      ) : (
                        <AiOutlineHeart size={13} />
                      )}
                      <span>{comment.likeCount}</span>
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

const TopRow = styled.div`
  margin-bottom: 10px;
`;

const BackButton = styled.button`
  display: flex;
  gap: 6px;
  margin: 30px 0 0 0;
  padding: 0;

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

const Title = styled.h1`
  font-size: 23px;
  font-weight: 800;
  line-height: 1.25;
  color: ${COLORS.text};
  margin: 20px 0 18px 0;

  @media screen and (max-width: 768px) {
    font-size: 34px;
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
  font-size: 16px;
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
  line-height: 1.5;
  color: ${COLORS.text};
  white-space: pre-wrap;
  margin-bottom: 130px;

  @media screen and (max-width: 768px) {
    font-size: 24px;
  }
`;

const BottomRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 44px;
`;

const LikeBox = styled.button`
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0;
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
  margin: 0 0 18px 0;
`;

const CommentInputWrap = styled.div`
  border: 1px solid ${COLORS.border};
  background: ${COLORS.white};
  height: 70px;
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
`;

const CommentInputContainer = styled.div`
  display: flex;
  width: 100%;
  box-sizing: border-box;
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
  height: 68px;
  font-size: 16px;
  color: ${COLORS.text};
  background: transparent;

  &::placeholder {
    color: #666666;
  }

  @media screen and (max-width: 768px) {
    font-size: 18px;
  }
`;

const CommentSubmitRow = styled.div`
  display: flex;
  justify-content: flex-end;

`;

const SubmitButton = styled.button`
  border: none;
  background: ${COLORS.primary};
  color: ${COLORS.white};
  padding: 10px 18px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  height: 70px;
  width: 80px;
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
`;

const CommentItem = styled.div`
  padding: 18px 18px;
  border-bottom: 1px solid ${COLORS.border};
`;

const CommentAuthor = styled.div`
  font-size: 18px;
  margin-bottom: 12px;
`;

const CompanyName = styled.span`
  color: #3aa5d9;
  font-weight: 500;
  font-size: 15px
`;

const MaskedId = styled.span`
  color: ${COLORS.gray};
  font-size: 15px;
`;

const CommentText = styled.div`
  font-size: 16px;
  line-height: 1.55;
  color: ${COLORS.text};
  margin-bottom: 19px;

  @media screen and (max-width: 768px) {
    font-size: 22px;
  }
`;

const CommentMetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  color: ${COLORS.gray};
  font-size: 16px;
`;

const CommentMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;
