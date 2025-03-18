import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import ArticleDetail from "./pages/ArticleDetail";
import Dashboard from "./pages/Dashboard";
import NewArticle from "./pages/NewArticle";
import EditArticle from "./pages/EditArticle"; 
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/new-article"
          element={
            <ProtectedRoute>
              <NewArticle />
            </ProtectedRoute>
          }
        />
        <Route
          path="/article/edit/:id"
          element={
            <ProtectedRoute>
              <EditArticle />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
