import axios from "axios";

// const BASE_URL = "http://localhost:8113";
const BASE_URL = "http://116.36.205.25:8113";

const AxiosApi = {
  // ==========================================
  //  Auth - 회원가입 / 로그인
  // ==========================================
  checkEmail: async (email) => {
    return await axios.get(`${BASE_URL}/api/auth/check-email?email=${email}`);
  },
  SignUp: async (email, password, name) => {
    return await axios.post(`${BASE_URL}/api/auth/signup`, {
      email,
      password,
      name,
    });
  },
  login: async (email, password) => {
    return await axios.post(`${BASE_URL}/api/auth/login`, { email, password });
  },

  // ==========================================
  //  User - 회원 조회 / 수정
  // ==========================================

  // [관리자] 전체 유저 목록
  // 응답: { success, message, data: [ { userId, email, name, isAdmin, companyName, certStatus, createdAt }, ... ] }
  getUserList: async () => {
    return await axios.get(`${BASE_URL}/api/users`);
  },

  // 단건 조회
  getUser: async (userId) => {
    return await axios.get(`${BASE_URL}/api/users/${userId}`);
  },

  // 수정
  updateUser: async (userId, name, password) => {
    return await axios.put(`${BASE_URL}/api/users/${userId}`, {
      name,
      password,
    });
  },

  // ==========================================
  //  Post - 게시글 CRUD
  // ==========================================
  getPostList: async () => {
    return await axios.get(`${BASE_URL}/api/posts`);
  },
  getPost: async (postId) => {
    return await axios.get(`${BASE_URL}/api/posts/${postId}`);
  },
  getMyPostList: async (userId) => {
    return await axios.get(`${BASE_URL}/api/posts/my/${userId}`);
  },
  searchPost: async (keyword) => {
    return await axios.get(`${BASE_URL}/api/posts/search?keyword=${keyword}`);
  },
  getPostListByCategory: async (category) => {
    return await axios.get(`${BASE_URL}/api/posts/category/${category}`);
  },
  writePost: async (userId, title, content, category) => {
    return await axios.post(`${BASE_URL}/api/posts`, {
      userId,
      title,
      content,
      category: category || "FREE",
    });
  },
  updatePost: async (postId, userId, title, content, category) => {
    return await axios.put(`${BASE_URL}/api/posts/${postId}`, {
      userId,
      title,
      content,
      category: category || "FREE",
    });
  },
  deletePost: async (postId, userId) => {
    return await axios.delete(
      `${BASE_URL}/api/posts/${postId}?userId=${userId}`,
    );
  },

  // ==========================================
  //  Comment - 댓글 CRUD
  // ==========================================
  getCommentList: async (postId) => {
    return await axios.get(`${BASE_URL}/api/posts/${postId}/comments`);
  },
  writeComment: async (postId, userId, content) => {
    return await axios.post(`${BASE_URL}/api/posts/${postId}/comments`, {
      userId,
      content,
    });
  },
  updateComment: async (postId, commentId, userId, content) => {
    return await axios.put(
      `${BASE_URL}/api/posts/${postId}/comments/${commentId}`,
      { userId, content },
    );
  },
  deleteComment: async (postId, commentId, userId) => {
    return await axios.delete(
      `${BASE_URL}/api/posts/${postId}/comments/${commentId}?userId=${userId}`,
    );
  },

  // ==========================================
  //  Like - 좋아요 (3조 전용)
  // ==========================================
  toggleLike: async (postId, userId) => {
    return await axios.post(`${BASE_URL}/api/posts/${postId}/likes/${userId}`);
  },
  isLiked: async (postId, userId) => {
    return await axios.get(`${BASE_URL}/api/posts/${postId}/likes/${userId}`);
  },

  // ==========================================
  //  Certification - 회사 인증 (3조 전용)
  // ==========================================
  applyCertification: async (userId, realName, age, companyName) => {
    return await axios.post(`${BASE_URL}/api/certifications/${userId}`, {
      realName,
      age,
      companyName,
    });
  },
  getMyCertification: async (userId) => {
    return await axios.get(`${BASE_URL}/api/certifications/${userId}`);
  },
  getPendingCertList: async () => {
    return await axios.get(`${BASE_URL}/api/certifications/admin/pending`);
  },
  approveCertification: async (certId) => {
    return await axios.put(
      `${BASE_URL}/api/certifications/admin/${certId}/approve`,
    );
  },
  rejectCertification: async (certId) => {
    return await axios.put(
      `${BASE_URL}/api/certifications/admin/${certId}/reject`,
    );
  },
};

export default AxiosApi;
