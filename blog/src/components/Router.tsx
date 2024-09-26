import {Navigate, Route, Routes} from "react-router-dom";
import React from "react";
import Home from "../pages/home";
import PostList from "../pages/posts";
import PostDetail from "../pages/posts/detail";
import PostNew from "../pages/posts/new";
import PostEdit from "../pages/posts/edit";
import ProfilePage from "../pages/profile/profile";
import LoginPage from "../pages/login";
import SignupPage from "../pages/signup";

export default function Router() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/posts" element={<PostList/>}/>
        <Route path="/posts/:id" element={<PostDetail/>}/>
        <Route path="/posts/new" element={<PostNew/>}/>
        <Route path="/posts/edit/:id" element={<PostEdit/>}/>
        <Route path="/profile" element={<ProfilePage/>}/>
        <Route path="/login" element={<LoginPage/>}></Route>
        <Route path="/signup" element={<SignupPage/>}></Route>
        <Route path="*" element={<Navigate replace to="/"/>}/>
      </Routes>
    </>
  );
}
