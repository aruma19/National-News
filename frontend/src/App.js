import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import SidebarAdmin from "./components/SidebarAdmin";
//User
import Register from "./pages/user/Register";
import Login from "./pages/user/Login";
import Dashboard from "./pages/user/Dashboard";
import Detail from "./pages/user/Detail";
import LikedNews from "./pages/user/LikedNews";
import ProfileUser from "./pages/user/ProfileUser";
//Admin
import AddNews from "./pages/admin/AddNews";
import EditNews from "./pages/admin/EditNews";
import CategoryList from "./pages/admin/CategoryList";
import EditCategory from "./pages/admin/EditCategory";
import DetailAdmin from "./pages/admin/DetailAdmin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* User */}
        <Route path="/" element={<Login />} /> { }
        <Route path="/register" element={<Register />} /> { }
        <Route path="/dashboard" element={
          <>
            <Sidebar />
            <Dashboard />
          </>
        } />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/liked-news" element={
          <>
            <Sidebar />
            <LikedNews />
          </>
        } />
        <Route path="/profile-user" element={
          <>
            <Sidebar />
            <ProfileUser />
          </>
        } />

        {/* Admin */}
        <Route path="/addnews" element={
          <>
            <SidebarAdmin />
            <AddNews />
          </>
        } />
        <Route path="/editnews/:id" element={
          <>
            <SidebarAdmin />
            <EditNews />
          </>
        } />
        <Route path="/detailAdmin/:id" element={<DetailAdmin />} />
        <Route path="/categorylist" element={<><SidebarAdmin /><CategoryList /></>} />
        <Route path="/editcategory/:id" element={<><SidebarAdmin /><EditCategory /></>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
