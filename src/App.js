import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import PopularPage from "./pages/PopularPage";
import FreeboardPage from "./pages/FreeboardPage";
import InfoPage from "./pages/InfoPage";
import QnaPage from "./pages/QnaPage";
import EasterEgg from "./components/EasterEgg";

function App() {
  return (
    <Router>
      <EasterEgg />
      <Routes>
        {/* 메인 페이지 - 모든 게시판 한 곳에 표시 */}
        <Route path="/" element={<MainPage />} />

        {/* 각 게시판 페이지 */}
        <Route path="/popular" element={<PopularPage />} />
        <Route path="/freeboard" element={<FreeboardPage />} />
        <Route path="/info" element={<InfoPage />} />
        <Route path="/qna" element={<QnaPage />} />
      </Routes>
    </Router>
  );
}

export default App;
