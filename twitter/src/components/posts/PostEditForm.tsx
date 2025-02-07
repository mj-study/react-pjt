import { FiImage } from 'react-icons/fi';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../firebaseApp';
import AuthContext from '../../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { PostProps } from '../../pages/home';
import {
  getDownloadURL,
  ref,
  uploadString,
  deleteObject,
} from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

import PostHeader from './Header';
export default function PostEditForm() {
  const params = useParams();
  const [post, setPost] = useState<PostProps | null>(null);
  const [content, setContent] = useState<string>('');
  const [hashTag, setHashTag] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<string | null>('');

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const getPost = useCallback(async () => {
    if (params.id) {
      const docRef = doc(db, 'posts', params.id);
      const docSnap = await getDoc(docRef);
      setPost({ ...(docSnap?.data() as PostProps), id: docSnap.id });
      setContent(docSnap?.data()?.content);
      setTags(docSnap?.data()?.hashTags);
      setImageFile(docSnap?.data()?.imageUrl);
    }
  }, [params.id]);

  const onSubmit = async (e: any) => {
    setSubmitting(true);
    e.preventDefault();
    const key = `${user?.uid}/${uuidv4()}`;
    const storageRef = ref(storage, key);

    try {
      if (post) {
        // 기존 사진 삭제 -> 새로운 사진 업로드
        if (post?.imageUrl) {
          let imageRef = ref(storage, post?.imageUrl);
          await deleteObject(imageRef).catch((e) => {
            console.error(e);
          });
        }

        // 새로운 파일 있으면 업로드
        let imageUrl = '';
        if (imageFile) {
          const data = await uploadString(storageRef, imageFile, 'data_url');
          imageUrl = await getDownloadURL(data?.ref);
        }

        const postRef = doc(db, 'posts', post?.id);
        await updateDoc(postRef, {
          content: content,
          hashTags: tags,
          imageUrl: imageUrl,
        });
        navigate(`posts/${post?.id}`);
        toast.success('게시글을 수정했습니다.');
      }

      setImageFile(null);
      setSubmitting(false);
    } catch (e: any) {
      console.log(e);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === 'content') {
      setContent(value);
    }
  };

  useEffect(() => {
    if (params.id) getPost();
  }, [getPost, params.id]);

  const handleKeyUp = (e: any) => {
    if (e.keyCode === 32 && e.target.value.trim() !== '') {
      // 만약 같은 태그가 있다면 에러 발생
      // 아니라면 -> 값이 있는경우에만 태그 생성
      if (tags?.includes(e.target.value?.trim())) {
        toast.error('같은 태그가 있습니다.');
      } else {
        setTags((prev) => (prev?.length > 0 ? [...prev, hashTag] : [hashTag]));
        setHashTag('');
      }
    }
  };

  const onChangeHashTag = (e: any) => {
    setHashTag(e?.target.value?.trim());
  };

  const removeTag = (tag: string) => {
    setTags(tags?.filter((val) => val !== tag));
  };

  const handleFileUpload = (e: any) => {
    const {
      target: { files },
    } = e;

    const file = files?.[0];
    const fileReader = new FileReader();
    fileReader?.readAsDataURL(file);

    fileReader.onloadend = (e: any) => {
      const result = e?.currentTarget?.result;
      setImageFile(result);
    };
  };

  const handleDelete = () => {
    setImageFile(null);
  };

  return (
    <div className="post">
      <PostHeader />
      <form className="post-form" onSubmit={onSubmit}>
        <textarea
          className="post-form__textarea"
          required
          name="content"
          id="content"
          placeholder="What is happening?"
          onChange={onChange}
          value={content}
        />
        <div className="post-form__hashtags">
          <span className="post-form__hashtags-outputs">
            {tags?.map((tag, index) => (
              <span
                className="post-form__hashtags-tag"
                key={index}
                onClick={() => removeTag(tag)}
              >
                #{tag}
              </span>
            ))}
          </span>

          <input
            type="text"
            className="post-form__input"
            name="hashtag"
            id="hashtag"
            placeholder="해시태그 + 스페이스바 입력"
            onChange={onChangeHashTag}
            onKeyUp={handleKeyUp}
            value={hashTag}
          />
        </div>
        <div className="post-form__submit-area">
          <div className="post-form__image-area">
            <label htmlFor="file-input" className="post-form__file">
              <FiImage className="post-form__file-icon" />
            </label>
            <input
              type="file"
              name="file-input"
              id="file-input"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            {imageFile && (
              <div className="post-form__attachment">
                <img
                  src={imageFile}
                  alt="attachment"
                  width={100}
                  height={100}
                />
                <button
                  className="post-form__clear-btn"
                  type="button"
                  onClick={handleDelete}
                >
                  Clear
                </button>
              </div>
            )}
          </div>
          <label htmlFor="file-input" className="post-form__file">
            <FiImage className="post-form__file-icon" />
          </label>
          <input
            type="file"
            name="file-input"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <input
            type="submit"
            value="수정"
            className="post-form__submit-btn"
            disabled={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
}
