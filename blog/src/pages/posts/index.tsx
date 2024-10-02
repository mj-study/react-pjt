import React from 'react';
import Header from 'components/Header';
import Footer from 'components/Footer';
import PostList from 'components/PostList';
import Carousel from '../../components/Carousel';

export default function PostsPage() {
  return (
    <>
      <Header />
      <Carousel />
      <PostList hasNavigation={false} defaultTab="my" />
      <Footer />
    </>
  );
}
