import axios from "axios";

// ===== 서버 주소 설정 =====
const BASE_URL = "http://localhost:8113";

const AxiosApi = {
  // ==========================================
  //  Auth - 회원가입 / 로그인
  // ==========================================

  // 이메일 중복 확인 (true: 사용 가능, false: 중복)
  checkEmail: async (email) => {
    return await axios.get(`${BASE_URL}/api/auth/check-email?email=${email}`);
  },

  // 회원가입
  // 요청: { email, password, name }
  // 응답: { success, message, data: null }
  SignUp: async (email, password, name) => {
    return await axios.post(`${BASE_URL}/api/auth/signup`, {
      email,
      password,
      name,
    });
  },

  // 로그인
  // 요청: { email, password }
  // 응답: { success, message, data: { userId, email, name, isAdmin, companyName, certStatus } }
  login: async (email, password) => {
    return await axios.post(`${BASE_URL}/api/auth/login`, {
      email,
      password,
    });
  },

  // ==========================================
  //  User - 회원 정보 조회 / 수정
  // ==========================================

  // 전체 회원 정보 조회 - 임의 추가
  getUserList: async (userId) => {
    return await axios.get(`${BASE_URL}/api/users`);
  },

  // 회원 정보 조회
  getUser: async (userId) => {
    return await axios.get(`${BASE_URL}/api/users/${userId}`);
  },

  // 회원 정보 수정
  updateUser: async (userId, name, password) => {
    return await axios.put(`${BASE_URL}/api/users/${userId}`, {
      name,
      password,
    });
  },

  // ==========================================
  //  Post - 게시글 CRUD
  // ==========================================

  // 게시글 전체 목록 조회 (최신순)
  // 응답 data 배열 항목: { postId, userId, userName, maskedEmail, companyName,
  //                        title, content, category, viewCount, likeCount, createdAt }
  getPostList: async () => {
    return await axios.get(`${BASE_URL}/api/posts`);
  },

  // 게시글 단건 조회 (조회수 +1 자동)
  getPost: async (postId) => {
    return await axios.get(`${BASE_URL}/api/posts/${postId}`);
  },

  // 내 게시글 목록
  getMyPostList: async (userId) => {
    return await axios.get(`${BASE_URL}/api/posts/my/${userId}`);
  },

  // 게시글 제목 검색
  searchPost: async (keyword) => {
    return await axios.get(`${BASE_URL}/api/posts/search?keyword=${keyword}`);
  },

  // 카테고리별 게시글 목록
  // category: "FREE" | "QNA" | "INFO"
  getPostListByCategory: async (category) => {
    return await axios.get(`${BASE_URL}/api/posts/category/${category}`);
  },

  // 게시글 등록
  // 요청: { userId, title, content, category }
  // category: "FREE" | "QNA" | "INFO"
  writePost: async (userId, title, content, category) => {
    return await axios.post(`${BASE_URL}/api/posts`, {
      userId,
      title,
      content,
      category: category || "FREE",
    });
  },

  // 게시글 수정
  updatePost: async (postId, userId, title, content, category) => {
    return await axios.put(`${BASE_URL}/api/posts/${postId}`, {
      userId,
      title,
      content,
      category: category || "FREE",
    });
  },

  // 게시글 삭제
  deletePost: async (postId, userId) => {
    return await axios.delete(
      `${BASE_URL}/api/posts/${postId}?userId=${userId}`,
    );
  },

  // ==========================================
  //  Comment - 댓글 CRUD
  // ==========================================

  // 댓글 목록 조회
  // 응답 data 배열 항목: { commentId, postId, userId, userName, maskedEmail,
  //                        companyName, content, createdAt }
  getCommentList: async (postId) => {
    return await axios.get(`${BASE_URL}/api/posts/${postId}/comments`);
  },

  // 댓글 등록
  writeComment: async (postId, userId, content) => {
    return await axios.post(`${BASE_URL}/api/posts/${postId}/comments`, {
      userId,
      content,
    });
  },

  // 댓글 수정
  updateComment: async (postId, commentId, userId, content) => {
    return await axios.put(
      `${BASE_URL}/api/posts/${postId}/comments/${commentId}`,
      { userId, content },
    );
  },

  // 댓글 삭제
  deleteComment: async (postId, commentId, userId) => {
    return await axios.delete(
      `${BASE_URL}/api/posts/${postId}/comments/${commentId}?userId=${userId}`,
    );
  },

  // ==========================================
  //  Like - 좋아요 (3조 전용)
  // ==========================================

  // 좋아요 토글 (좋아요 → 취소, 취소 → 좋아요 자동 전환)
  // 응답: { success, message, data: { liked: true/false, likeCount: 42 } }
  toggleLike: async (postId, userId) => {
    return await axios.post(`${BASE_URL}/api/posts/${postId}/likes/${userId}`);
  },

  // 좋아요 여부 확인
  // 응답: { success, message, data: true/false }
  isLiked: async (postId, userId) => {
    return await axios.get(`${BASE_URL}/api/posts/${postId}/likes/${userId}`);
  },

  // ==========================================
  //  Certification - 회사 인증 (3조 전용)
  // ==========================================

  // 인증 신청
  // 요청: { realName, age, companyName }
  // 응답: { success, message, data: CertificationResDto }
  applyCertification: async (userId, realName, age, companyName) => {
    return await axios.post(`${BASE_URL}/api/certifications/${userId}`, {
      realName,
      age,
      companyName,
    });
  },

  // 내 인증 현황 조회
  // 응답: { success, message, data: { certId, status, companyName, appliedAt, reviewedAt } }
  getMyCertification: async (userId) => {
    return await axios.get(`${BASE_URL}/api/certifications/${userId}`);
  },

  // [관리자] 대기 중인 인증 목록
  // 응답: { success, message, data: [ CertificationResDto, ... ] }
  getPendingCertList: async () => {
    return await axios.get(`${BASE_URL}/api/certifications/admin/pending`);
  },

  // [관리자] 인증 승인
  approveCertification: async (certId) => {
    return await axios.put(
      `${BASE_URL}/api/certifications/admin/${certId}/approve`,
    );
  },

  // [관리자] 인증 거절
  rejectCertification: async (certId) => {
    return await axios.put(
      `${BASE_URL}/api/certifications/admin/${certId}/reject`,
    );
  },
};

export default AxiosApi;
