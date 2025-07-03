import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import {
  fetchPosts,
  likePost,
  addComment,
  deletePost,
  deleteComment,
  addPost
} from '../redux/post/postActions.js';

vi.mock('axios');
vi.mock('react-hot-toast');

describe('Post Actions', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        post: () => ({})
      }
    });
    vi.clearAllMocks();
  });

  describe('fetchPosts', () => {
    it('dispatches fulfilled action on success', async () => {
      const mockData = {
        posts: [{ id: 1, title: 'Test Post' }],
        reels: [],
        hasMore: false,
        nextCursor: null
      };

      axios.get.mockResolvedValueOnce({ data: mockData });

      const result = await store.dispatch(fetchPosts({ cursor: null, limit: 5 }));

      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/api/post/all'),
        {
          params: { cursor: null, limit: 5, type: 'post' },
          withCredentials: true
        }
      );

      expect(result.type).toBe('post/fetchAll/fulfilled');
      expect(result.payload).toEqual(mockData);
    });

    it('dispatches rejected action on failure', async () => {
      axios.get.mockRejectedValueOnce(new Error('Network Error'));

      const result = await store.dispatch(fetchPosts({ cursor: null, limit: 5 }));

      expect(result.type).toBe('post/fetchAll/rejected');
      expect(result.error.message).toBe('Network Error');
    });
  });

  describe('addPost', () => {
    it('dispatches fulfilled action on success', async () => {
      const formdata = new FormData();
      formdata.append('title', 'New Post');

      const mockResponse = { message: 'Created', post: { id: 1 } };
      axios.post.mockResolvedValueOnce({ data: mockResponse });
      toast.success.mockImplementation(() => { });

      const result = await store.dispatch(addPost({ formdata, type: 'post' }));

      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/post/new?type=post'),
        formdata,
        { withCredentials: true }
      );

      expect(toast.success).toHaveBeenCalledWith('Created');
      expect(result.type).toBe('post/add/fulfilled');
      expect(result.payload).toEqual(mockResponse);
    });

    it('dispatches rejected action on failure', async () => {
      const formdata = new FormData();
      axios.post.mockRejectedValueOnce(new Error('Upload failed'));

      const result = await store.dispatch(addPost({ formdata, type: 'post' }));

      expect(result.type).toBe('post/add/rejected');
      expect(result.error.message).toBe('Upload failed');
    });
  });

  describe('likePost', () => {
    it('likes a post', async () => {
      const mockResponse = { message: 'Liked' };
      axios.post.mockResolvedValueOnce({ data: mockResponse });
      toast.success.mockImplementation(() => { });

      const result = await store.dispatch(likePost(1));

      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/post/like/1'),
        null,
        { withCredentials: true }
      );

      expect(toast.success).toHaveBeenCalledWith('Liked');
      expect(result.payload).toEqual(mockResponse);
    });
  });

  describe('addComment', () => {
    it('adds a comment', async () => {
      const mockResponse = { message: 'Commented' };
      axios.post.mockResolvedValueOnce({ data: mockResponse });
      toast.success.mockImplementation(() => { });

      const result = await store.dispatch(addComment({ id: 1, comment: 'Nice!' }));

      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/post/comment/1'),
        { comment: 'Nice!' },
        { withCredentials: true }
      );

      expect(toast.success).toHaveBeenCalledWith('Commented');
      expect(result.payload).toEqual(mockResponse);
    });
  });

  describe('deletePost', () => {
    it('deletes a post', async () => {
      const mockResponse = { message: 'Deleted' };
      axios.delete.mockResolvedValueOnce({ data: mockResponse });
      toast.success.mockImplementation(() => { });

      const result = await store.dispatch(deletePost(1));

      expect(axios.delete).toHaveBeenCalledWith(
        expect.stringContaining('/api/post/1'),
        { withCredentials: true }
      );

      expect(toast.success).toHaveBeenCalledWith('Deleted');
      expect(result.payload).toEqual(mockResponse);
    });
  });

  describe('deleteComment', () => {
    it('deletes a comment', async () => {
      const mockResponse = { message: 'Comment Deleted' };
      axios.delete.mockResolvedValueOnce({ data: mockResponse });
      toast.success.mockImplementation(() => { });

      const result = await store.dispatch(deleteComment({ id: 1, commentId: 2 }));

      expect(axios.delete).toHaveBeenCalledWith(
        expect.stringContaining('/api/post/comment/1?commentId=2'),
        { withCredentials: true }
      );

      expect(toast.success).toHaveBeenCalledWith('Comment Deleted');
      expect(result.payload).toEqual(mockResponse);
    });
  });
});