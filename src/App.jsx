import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/posts/Home";
import New from "./pages/posts/New";
import PostDetail from "./components/posts/PostDetail";
import Profile from "./pages/user/Profile";
import Explore from "./pages/explore/Explore";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={<Home />} />
      <Route path="/posts/:id" element={<PostDetail />} />
      <Route path="/posts/new" element={<New />} />
      <Route path="/posts/:id/edit" element={<New />} />

      <Route path="/users/:id" element={<Profile />} />

      <Route path="/explore" element={<Explore />} />
    </Routes>
  );
}

export default App;