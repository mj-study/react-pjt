import { Link, useNavigate } from 'react-router-dom';
import { FaRegComment, FaUserCircle } from 'react-icons/fa';
import React, { useContext } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { PostProps } from '../../pages/home';
import AuthContext from '../../context/AuthContext';

import { ref, deleteObject } from 'firebase/storage';
import { storage } from 'firebaseApp';
import {
  doc,
  deleteDoc,
  updateDoc,
  arrayRemove,
  arrayUnion,
} from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from '../../firebaseApp';

interface PostBoxProps {
  post: PostProps;
}

export default function PostBox({ post }: PostBoxProps) {
  const { user } = useContext(AuthContext);
  const imageRef = ref(storage, post?.imageUrl);

  const navigate = useNavigate();
  const handleDelete = async () => {
    const confirm = window.confirm('해당 게시글을 삭제하시겠습니까?');
    if (confirm) {
      // 스토리지 이미지 삭제
      if (post?.imageUrl) {
        deleteObject(imageRef).catch((err) => {
          console.error(err);
        });
      }

      await deleteDoc(doc(db, 'posts', post.id));
      toast.success('게시글을 삭제했습니다.');
      navigate('/');
    }
  };

  const toggleLike = async () => {
    const postRef = doc(db, 'posts', post.id);

    if (user?.uid && post?.likes?.includes(user?.uid)) {
      // 사용자가 좋아요를 미리 한 경우 -> 좋아요 취소
      await updateDoc(postRef, {
        likes: arrayRemove(user?.uid),
        likeCount: post?.likeCount ? post?.likeCount - 1 : 0,
      });
    } else {
      // 사용자가 좋아요 하지 않은 경우 -> 좋아요 추가
      await updateDoc(postRef, {
        likes: arrayUnion(user?.uid),
        likeCount: post?.likeCount ? post?.likeCount + 1 : 1,
      });
    }
  };
  return (
    <div className="post__box" key={post.id}>
      <Link to={`/posts/${post?.id}`}>
        <div className="post__box-profile">
          <div className="post__flex">
            {post?.profileUrl ? (
              <img
                src={post?.profileUrl}
                alt="profile"
                className="post__box-profile-img"
              />
            ) : (
              <FaUserCircle className="post__box-profile-icon" />
            )}
            <div className="post__email">{post?.email}</div>
            <div className="post__createdAt">{post?.createdAt}</div>
          </div>
          <div className="post__box-content">{post?.content}</div>
          {post?.imageUrl && (
            <div className="post__image-div">
              <img
                src={post?.imageUrl}
                alt={'post img'}
                className="post__image"
                width={100}
                height={100}
              />
            </div>
          )}
          <div className="post-form__hashtags-outputs">
            {post?.hashTags?.map((tag, index) => (
              <span className="post-form__hashtags-tag" key={index}>
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
      <div className="post__box-footer">
        {user?.uid === post?.uid && (
          <>
            <button
              type="button"
              className="post__delete"
              onClick={handleDelete}
            >
              Delete
            </button>
            <button type="button" className="post__edit">
              <Link to={`/posts/edit/${post?.id}`}>Edit</Link>
            </button>
          </>
        )}

        <button type="button" className="post__likes" onClick={toggleLike}>
          {user && post?.likes?.includes(user.uid) ? (
            <AiFillHeart />
          ) : (
            <AiOutlineHeart />
          )}
          {post?.likeCount || 0}
        </button>
        <button type="button" className="post__comments">
          <FaRegComment />
          {post?.comments?.length || 0}
        </button>
      </div>
    </div>
  );
}
