"use server";

import { Comment, APIData, Post, PostDetail } from "../types";

export const getItems = async (
  page: number = 1,
  limit: number = 8
): Promise<APIData> => {
  try {
    const response = await fetch(`${process.env.PUBLIC_API}/posts`);

    if (!response.ok) {
      throw new Error(`Failed to fetch items: ${response.statusText}`);
    }

    const allData: Post[] = await response.json();
    const totalPosts = allData.length;
    const totalPages = Math.ceil(totalPosts / limit);

    // calculating start and end index for pagination
    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit, totalPosts);

    // slicing the data to get the requested page
    const paginatedData = allData.slice(startIndex, endIndex);
    const totalPostsOnPage = paginatedData.length;

    return {
      posts: paginatedData,
      totalPosts: totalPostsOnPage,
      page,
      limit,
      totalPages,
    };
  } catch (error) {
    console.error("Error fetching items:", error);
    return {
      posts: [],
      totalPosts: 0,
      page,
      limit,
      totalPages: 0,
    };
  }
};

export const getItemDetail = async (id: number): Promise<PostDetail | null> => {
  try {
    // fetching post details
    const postResponse = await fetch(`${process.env.PUBLIC_API}/posts/${id}`);

    if (!postResponse.ok) {
      throw new Error(
        `Failed to fetch item detail: ${postResponse.statusText}`
      );
    }

    const postData: Post = await postResponse.json();

    // fetching post comments
    const commentsResponse = await fetch(
      `${process.env.PUBLIC_API}/comments?postId=${id}`
    );

    if (!commentsResponse.ok) {
      throw new Error(
        `Failed to fetch comments: ${commentsResponse.statusText}`
      );
    }

    const commentsData: Comment[] = await commentsResponse.json();

    return {
      info: postData,
      comments: commentsData,
    };
  } catch (error) {
    console.error(`Error fetching item detail for id ${id}:`, error);
    return null;
  }
};
