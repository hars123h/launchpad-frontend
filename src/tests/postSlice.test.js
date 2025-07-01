import postReducer from '../redux/post/postSlice.js';
import {
  fetchPosts,
  addPost
} from '../redux/post/postActions.js';

const initialState = {
  posts: [],
  reels: [],
  postsCursor: null,
  reelsCursor: null,
  hasMorePosts: true,
  hasMoreReels: true,
  loading: false,
  fetchLoading: false,
  addLoading: false,
  hasMore: true,
};

describe('postSlice reducer', () => {
  it('should return the initial state', () => {
    expect(postReducer(undefined, { type: '' })).toEqual(initialState);
  });

  // === FETCH POSTS ===
  it('should handle fetchPosts.pending', () => {
    const action = { type: fetchPosts.pending.type };
    const state = postReducer(initialState, action);
    expect(state.fetchLoading).toBe(true);
  });

  it('should handle fetchPosts.fulfilled', () => {
    const action = {
      type: fetchPosts.fulfilled.type,
      payload: {
        posts: [{ id: 1, title: 'Post 1' }],
        reels: [{ id: 2, title: 'Reel 1' }]
      }
    };

    const state = postReducer({ ...initialState, fetchLoading: true }, action);
    expect(state.fetchLoading).toBe(false);
    expect(state.posts).toEqual([{ id: 1, title: 'Post 1' }]);
    expect(state.reels).toEqual([{ id: 2, title: 'Reel 1' }]);
  });

  it('should handle fetchPosts.rejected', () => {
    const action = { type: fetchPosts.rejected.type };
    const state = postReducer({ ...initialState, fetchLoading: true }, action);
    expect(state.fetchLoading).toBe(false);
  });

  // === ADD POST ===
  it('should handle addPost.pending', () => {
    const action = { type: addPost.pending.type };
    const state = postReducer(initialState, action);
    expect(state.addLoading).toBe(true);
  });

  it('should handle addPost.fulfilled', () => {
    const action = { type: addPost.fulfilled.type };
    const state = postReducer({ ...initialState, addLoading: true }, action);
    expect(state.addLoading).toBe(false);
  });

  it('should handle addPost.rejected', () => {
    const action = { type: addPost.rejected.type };
    const state = postReducer({ ...initialState, addLoading: true }, action);
    expect(state.addLoading).toBe(false);
  });
});