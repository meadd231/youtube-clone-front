import "./App.css";
import styled from "styled-components";
import { HamburgerIcon, UploadIcon } from "./components/Icons";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  BrowserRouter,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';

const handleToggleSidebar = () => {};

const ContentWrapper = styled.div.attrs({ className: 'content' })`
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
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </ContentWrapper>
    </BrowserRouter>
  );
}

export default AppRouter;
