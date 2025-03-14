import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import ArticleDetail from "./pages/ArticleDetail"; 

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/article/:id" element={<ArticleDetail />} />{" "}
        {/* ✅ Add route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
