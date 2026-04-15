import axios from "axios";

// ===== 서버 주소 설정 =====
// 로컬 개발 시
const BASE_URL = "http://localhost:8111";
// 외부 서버 사용 시 아래 주석 해제
// const BASE_URL = "http://서버IP:8111";

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
  signUp: async (email, password, name) => {
    return await axios.post(`${BASE_URL}/api/auth/signup`, {
      email,
      password,
      name,
    });
  },

  // 로그인
  // 요청: { email, password }
  // 응답: { success, message, data: { userId, email, name, isAdmin } }
  login: async (email, password) => {
    return await axios.post(`${BASE_URL}/api/auth/login`, {
      email,
      password,
    });
  },

  // ==========================================
  //  User - 회원 정보 조회 / 수정
  // ==========================================

  // 회원 정보 조회
  // 응답: { success, message, data: { userId, email, name, isAdmin, createdAt } }
  getUser: async (userId) => {
    return await axios.get(`${BASE_URL}/api/users/${userId}`);
  },

  // 회원 정보 수정 (변경할 항목만 전달, 빈값이면 변경 안 함)
  // 요청: { name, password }
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
  // 응답: { success, message, data: [ { postId, userId, userName, title, content, category, createdAt }, ... ] }
  getPostList: async () => {
    return await axios.get(`${BASE_URL}/api/posts`);
  },

  // 게시글 단건 조회
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
  getPostListByCategory: async (category) => {
    return await axios.get(`${BASE_URL}/api/posts/category/${category}`);
  },

  // 게시글 등록
  // 요청: { userId, title, content, category }
  // category: 생략 가능 (기본값: null)
  writePost: async (userId, title, content, category) => {
    return await axios.post(`${BASE_URL}/api/posts`, {
      userId,
      title,
      content,
      category: category || null,
    });
  },

  // 게시글 수정
  // 요청: { userId, title, content, category }
  updatePost: async (postId, userId, title, content, category) => {
    return await axios.put(`${BASE_URL}/api/posts/${postId}`, {
      userId,
      title,
      content,
      category: category || null,
    });
  },

  // 게시글 삭제
  deletePost: async (postId, userId) => {
    return await axios.delete(`${BASE_URL}/api/posts/${postId}?userId=${userId}`);
  },

  // ==========================================
  //  Comment - 댓글 CRUD
  // ==========================================

  // 특정 게시글 댓글 목록 조회
  // 응답: { success, message, data: [ { commentId, postId, userId, userName, content, createdAt }, ... ] }
  getCommentList: async (postId) => {
    return await axios.get(`${BASE_URL}/api/posts/${postId}/comments`);
  },

  // 댓글 등록
  // 요청: { userId, content }
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
      { userId, content }
    );
  },

  // 댓글 삭제
  deleteComment: async (postId, commentId, userId) => {
    return await axios.delete(
      `${BASE_URL}/api/posts/${postId}/comments/${commentId}?userId=${userId}`
    );
  },
};

export default AxiosApi;
