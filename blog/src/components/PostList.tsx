import {useState} from "react";
import {Link} from "react-router-dom";
import React from "react";

interface PostListProps {
  hasNavigation?: boolean;
}

type TabType = "all" | "my";

export default function PostList({hasNavigation = true}: PostListProps) {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  return (
    <>
      {hasNavigation && (
        <div className="post__navigation">
          <div role="presentation"
               onClick={() => setActiveTab("all")}
               className={activeTab === "all" ? "post__navigation--active" : ""}
          >
            전체
          </div>
          <div role="presentation"
               onClick={() => setActiveTab("my")}
               className={activeTab === "my" ? "post__navigation--active" : ""}
          >
            나의 글
          </div>
        </div>
      )}
      <div className="post__list">
        {[...Array(10)].map((e, index) => (
            <div key={index} className="post__box">
              <Link to={`/posts/${index}`}>
                <div className="post__profile-box">
                  <div className="post__profile"/>
                  <div className="post__author-name">패스트캠퍼스</div>
                  <div className="post__date">2024.09.27 금요일</div>
                </div>
                <div className='post__title'>게시글 {index}</div>
                <div className="post__text">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Vivamus luctus urna sed urna ultricies ac tempor dui sagittis.
                  In condimentum facilisis porta.
                  Sed nec diam eu diam mattis viverra.
                  Nulla fringilla, orci ac euismod semper, magna diam porttitor mauris.
                  Quisque ut dolor gravida, placerat libero vel, euismod.
                  Fusce dapibus, tellus ac cursus commodo, tortor mauris.
                  Cras mattis consectetur purus sit amet fermentum.
                  Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis.
                  Etiam porta sem malesuada magna mollis euismod.
                </div>
                <div className="post__utils-box">
                  <div className="post__delete">삭제</div>
                  <div className="post__edit">수정</div>
                </div>
              </Link>
            </div>
          )
        )}
      </div>
    </>
  );
};
