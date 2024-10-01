import React from 'react';
import { Link } from 'react-router-dom';

export default function PostDetail() {
  return (
    <>
      <div className="post__detail">
        <div className="post__box">
          <div className="post__title">
            Understanding React Hooks: A Comprehensive Guide
          </div>
          <div className="post__profile-box">
            <div className="post__profile" />
            <div className="post__author-name">패스트캠퍼스</div>
            <div className="post__date">2024.09.27 금요일</div>
          </div>
          <div className="post__title">게시글</div>
          <div className="post__utils-box">
            <div className="post__delete">삭제</div>
            <div className="post__edit">
              <Link to={`/posts/edit/1`}>수정</Link>
            </div>
          </div>
          <div className="post__text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
            luctus urna sed urna ultricies ac tempor dui sagittis. In
            condimentum facilisis porta. Sed nec diam eu diam mattis viverra.
            Nulla fringilla, orci ac euismod semper, magna diam porttitor
            mauris. Quisque ut dolor gravida, placerat libero vel, euismod.
            Fusce dapibus, tellus ac cursus commodo, tortor mauris. Cras mattis
            consectetur purus sit amet fermentum. Aenean eu leo quam.
            Pellentesque ornare sem lacinia quam venenatis. Etiam porta sem
            malesuada magna mollis euismod.
          </div>
        </div>
      </div>
    </>
  );
}
