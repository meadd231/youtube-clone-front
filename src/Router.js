import "./App.css";
import styled from "styled-components";
import {
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Sidebar from "./components/Sidebar";

import Home from "./pages/Home";
import Watch from "./pages/Watch";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VideosUpload from "./pages/VideosUpload";
import Editing from "./pages/Editing";

import Auth from "./hooks/auth";

const ContentWrapper = styled.div.attrs({ className: "content" })`
  display: flex;
  padding-top: 60px;
  width: 100%;
`;

function AppRouter() {
  return (
    <BrowserRouter>
      <ContentWrapper>
        <Navbar />
        <Sidebar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watch/:videoId" element={<Watch />} />
          <Route path="/login" element={Auth(Login, false)} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/studio/videos" element={Auth(VideosUpload, true)} />
          <Route path="/studio" element={Auth(Editing, true)} />
        </Routes>
      </ContentWrapper>
    </BrowserRouter>
  );
}

export default AppRouter;
