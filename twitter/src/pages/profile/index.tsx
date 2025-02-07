import React, { useContext, useEffect, useState } from 'react';
import { PostProps } from '../home';
import PostBox from '../../components/posts/PostBox';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../../firebaseApp';
import AuthContext from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PROFILE_DEFAULT_URL =
  'data:image/jpeg;base64,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OhwaNY9W3Hrurr2kRVNTh00NKHGaUxw3YLlrJHtbI7ngNJuel7qbwfDIsGgip4W6Yo2hjWjyHU+ZJ3J6klQ/8uL9KT1r/KhS5fxSv0NrMRgpGSO0CGhbaSQkE6GTSm4dYE+EHgq2ZZynSZZae4j8bv1k8h1zSHm75Dud+gsFmxnAWYtPRzuc4GlkdI1otpcXMLPFfyve6l1NWla8VjSObTPkREXTwREQEREBERAREQEREBERAREQEREBERAXPa62dMZbB71Hh1pJerZKx1wxh6HQ25+dwVsZizVNis78MwyzqkeGoqzfuaMbg3P7UnNmjqPQgWLKuXYssUzaeK5td0kjvflkPvSPPUn8AAOiCYREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQY4adkGota1pcdTi0AanfE63J9VkREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREH//Z';

export default function ProfilePage() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState<PostProps[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      let postsRef = collection(db, 'posts');
      // 로그인된 사용자 정보
      let postsQuery = query(
        postsRef,
        where('uid', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      onSnapshot(postsQuery, (snapshot) => {
        let dataObj = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc?.id,
        }));
        setPosts(dataObj as PostProps[]);
      });
    }
  }, [user]);

  return (
    <div className="home">
      <div className="home__top">
        <div className="home__title">Profile</div>
        <div className="profile">
          <img
            src={user?.photoURL || PROFILE_DEFAULT_URL}
            alt="profile"
            className="profile_image"
            width={100}
            height={100}
          />
          <button
            className="profile__btn"
            type="button"
            onClick={() => navigate('/profile/edit')}
          >
            프로필 수정
          </button>
        </div>
        <div className="profile__text">
          <div className="profile__name">{user?.displayName || '사용자님'}</div>
          <div className="profile__email">{user?.email}</div>
        </div>
        <div className="home__tabs">
          <div className="home__tab home__tab--active">For You</div>
          <div className="home__tab">Likes</div>
        </div>
        <div className="post">
          {posts?.length > 0 ? (
            posts?.map((post) => <PostBox post={post} key={post.id} />)
          ) : (
            <div className="post__no-posts">
              <div className="post__text">게시글이 없습니다.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
