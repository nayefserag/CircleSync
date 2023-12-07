const { createPost, updatePost ,deletePost,getAllPosts,likeAndUnlikePost,getAllComments ,searchPosts} = require('../../services/Posts'); // Adjust the path as necessary
const Post = require('../../models/Posts'); 
const User = require('../../models/users');
const Comment = require('../../models/comments');
const helpers = require('../../helpers/helpers'); 

// Jest mock functions for external dependencies
jest.mock('../../models/Posts'); 
jest.mock('../../helpers/helpers');

describe('Post Controller', () => {
    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();
    
        // Mock findById method of Post
        Post.findById = jest.fn().mockImplementation((id) => {
            return {
                userId: '12345',
                updateOne: jest.fn().mockResolvedValue({}),
                remove: jest.fn().mockResolvedValue({}),
                // Mock other instance methods as needed
            };
        });
    
        // Mock other static methods of Post as needed
        Post.prototype.save = jest.fn().mockResolvedValue({
            post: 'Test post content',
            userId: '12345',
            hashtags: ['#test']
        });

        User.findById = jest.fn().mockImplementation((id) => {
            return {
                userId: '12345',
                updateOne: jest.fn().mockResolvedValue({}),
                remove: jest.fn().mockResolvedValue({}),
                // Mock other instance methods as needed
            };
        })

        Comment.findById = jest.fn().mockImplementation((id) => {
            return {
                userId: '12345',
                updateOne: jest.fn().mockResolvedValue({}),
                remove: jest.fn().mockResolvedValue({}),
                // Mock other instance methods as needed
            };
        })
    });

    describe('createPost', () => {
        it('should create a post and return it', async () => {
            const mockRequest = {
                body: {
                    post: 'Test post content',
                    userId: '12345'
                },
                headers: {
                    'accept-language': 'en'
                }
            };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const mockNext = jest.fn(); // Mock next function for middleware
            await createPost(mockRequest, mockResponse, mockNext);
        });
    });

    describe('updatePost', () => {
        it('should update a post if user is authorized', async () => {
            const mockRequest = {
                body: {
                    post: 'Updated post content',
                    userId: '12345'
                },
                params: {
                    postId: 'post123'
                },
                headers: {
                    'accept-language': 'en'
                }
            };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            Post.findById.mockResolvedValue({
                userId: '12345',
                updateOne: jest.fn().mockResolvedValue({})
            });

            // Call the function to test
            await updatePost(mockRequest, mockResponse);

            // Assert that the response was as expected
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith('Post updated successfully');
        });
    });

    describe('deletePost', () => {
        it('should delete a post if user is admin', async () => {
            const mockRequest = {
                params: { postId: 'post123' },
                headers: { 'accept-language': 'en' },
                user: { isAdmin: true }
            };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            Post.findByIdAndDelete.mockResolvedValue(true);
    
            await deletePost(mockRequest, mockResponse);
    
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith('Admin successfully deleted the post');
        });
    
        it('should delete a post if user is the owner', async () => {
            const mockRequest = {
                params: { postId: 'post123' },
                headers: { 'accept-language': 'en' },
                user: { isAdmin: false },
                body: { userId: '12345' }
            };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            Post.findById.mockResolvedValue({ userId: '12345' });
            Post.findByIdAndRemove.mockResolvedValue(true);
    
            await deletePost(mockRequest, mockResponse);
    
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith('Post deleted successfully');
        });
    
        it('should return 404 if post not found', async () => {
            const mockRequest = {
                params: { postId: 'post123' },
                headers: { 'accept-language': 'en' },
                user: { isAdmin: true }
            };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            Post.findByIdAndDelete.mockResolvedValue(null);
    
            await deletePost(mockRequest, mockResponse);
    
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({message :"Post not found"});
        });
    
        it('should return 403 if user is not authorized', async () => {
            const mockRequest = {
                params: { postId: 'post123' },
                headers: { 'accept-language': 'en' },
                user: { isAdmin: false },
                body: { userId: 'wrong-user' }
            };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            Post.findById.mockResolvedValue({ userId: '12345' });
    
            await deletePost(mockRequest, mockResponse);
    
            expect(mockResponse.status).toHaveBeenCalledWith(403);
            expect(mockResponse.json).toHaveBeenCalledWith({message :"Unauthorized user"});
        });
    });
    
    describe('getAllPosts', () => {
        it('should return 404 if user is not found', async () => {
            const mockRequest = {
                body: { userId: 'user123' },
                headers: { 'accept-language': 'en' }
            };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            User.findById.mockResolvedValue(null);
    
            await getAllPosts(mockRequest, mockResponse);
    
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith('User not found');
        });
    
        it('should return 404 if user and followings have no posts', async () => {
            const mockRequest = {
                body: { userId: 'user123' },
                headers: { 'accept-language': 'en' }
            };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            User.findById.mockResolvedValue({ _id: 'user123', followings: [] });
            Post.find.mockResolvedValue([]);
    
            await getAllPosts(mockRequest, mockResponse);
    
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith('User has no posts');
        });
    
        it('should return all posts of the user and followings', async () => {
            const mockRequest = {
                body: { userId: 'user123' },
                headers: { 'accept-language': 'en' }
            };
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };
    
            const userPosts = [{ content: 'user post' }];
            const friendPosts = [[{ content: 'friend post' }]];
            User.findById.mockResolvedValue({ _id: 'user123', followings: ['friend123'] });
            Post.find.mockImplementation((query) => {
                if (query.userId === 'user123') {
                    return Promise.resolve(userPosts);
                }
                if (query.userId === 'friend123') {
                    return Promise.resolve(friendPosts[0]);
                }
            });
    
            await getAllPosts(mockRequest, mockResponse);
    
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.send).toHaveBeenCalledWith([...userPosts, ...friendPosts[0]]);
        });
    });
    
    describe('likeAndUnlikePost', () => {
        let mockRequest, mockResponse, FCM;
    
        beforeEach(() => {
            mockRequest = {
                body: { userId: 'user123', author: 'authorName' },
                params: { postId: 'post123' },
                headers: { 'accept-language': 'en' }
            };
            mockResponse = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
                json: jest.fn()
            };
            FCM = jest.fn().mockImplementation(() => {
                return {
                    send: jest.fn((message, callback) => callback(null, 'success'))
                };
            });
            global.FCM = FCM;
        });
    
        it('should return 404 if user is not found', async () => {
            User.findById.mockResolvedValue(null);
    
            await likeAndUnlikePost(mockRequest, mockResponse);
    
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith('User not found');
        });
    
        it('should return 404 if post is not found', async () => {
            User.findById.mockResolvedValue({}); // Mock user found
            Post.findById.mockResolvedValue(null); // Mock post not found
    
            await likeAndUnlikePost(mockRequest, mockResponse);
    
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith('Post not found');
        });
    
        it('should unlike a post if already liked', async () => {
            const post = {
                likes: ['user123'],
                updateOne: jest.fn()
            };
            User.findById.mockResolvedValue({}); // Mock user found
            Post.findById.mockResolvedValue(post); // Mock post found
    
            await likeAndUnlikePost(mockRequest, mockResponse);
    
            expect(post.updateOne).toHaveBeenCalledWith({ $pull: { likes: 'user123' } });
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.send).toHaveBeenCalledWith('Post is no longer liked');
        });
    });
    
    describe('addComment', () => {
        let mockRequest, mockResponse, FCM, serverKey;
        mockRequest = {
            body: { author: 'authorName', commentText: 'Nice post!' },
            params: { postId: 'post123' },
            headers: { 'accept-language': 'en' }
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        beforeEach(() => {
            mockRequest = {
                body: { author: 'authorName', commentText: 'Nice post!' },
                params: { postId: 'post123' },
                headers: { 'accept-language': 'en' }
            };
            mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            FCM = jest.fn().mockImplementation(() => {
                return {
                    send: jest.fn((message, callback) => callback(null, 'success'))
                };
            });
            global.FCM = FCM;
            serverKey = 'your-server-key'; // Replace with your actual server key
        });
    
        it('should add a comment to a post and send a notification', async () => {
            const post = {
                comments: [],
                save: jest.fn().mockResolvedValue({}),
                userId: 'user456'
            };
            const notifiedUser = { fcmToken: 'token' };
    
            Post.findById.mockResolvedValue(post);
            User.findById.mockResolvedValue(notifiedUser);
            Comment.findById.mockResolvedValue({});
            expect(post.comments).not.toContainEqual(mockRequest.body);
        });
    
    });
    
    describe('searchPosts', () => {
        let mockRequest, mockResponse;
    
        beforeEach(() => {
            mockRequest = {
                params: { hashtag: 'exampleHashtag' },
                headers: { 'accept-language': 'en' }
            };
            mockResponse = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };
        });
    
        it('should return posts matching the hashtag', async () => {
            const matchingPosts = [{ content: 'Post with #exampleHashtag' }];
            Post.find.mockResolvedValue(matchingPosts);
    
            await searchPosts(mockRequest, mockResponse);
    
            expect(Post.find).toHaveBeenCalledWith({ hashtags: ['exampleHashtag'] });
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.send).toHaveBeenCalledWith(matchingPosts);
        });
    
        it('should return an empty array if no posts are found', async () => {
            Post.find.mockResolvedValue([]);
    
            await searchPosts(mockRequest, mockResponse);
    
            expect(Post.find).toHaveBeenCalledWith({ hashtags: ['exampleHashtag'] });
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.send).toHaveBeenCalledWith([]);
        });
    });
    
    describe('getAllComments', () => {
        let mockRequest, mockResponse;
    
        beforeEach(() => {
            mockRequest = {
                params: { postId: 'post123' },
                headers: { 'accept-language': 'en' }
            };
            mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
        });
    
        it('should return all comments for a post', async () => {
            const postWithComments = {
                comments: [{ content: 'Great post!', author: 'user123' }]
            };
            Post.findById.mockResolvedValue(postWithComments);
    
            await getAllComments(mockRequest, mockResponse);
    
            expect(Post.findById).toHaveBeenCalledWith('post123', {
                __v: 0,
                _id: 0,
                'comments._id': 0,
                'comments.createdAt': 0
            });
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(postWithComments.comments);
        });
    
        it('should return an empty array if no comments are found', async () => {
            const postWithoutComments = { comments: [] };
            Post.findById.mockResolvedValue(postWithoutComments);
    
            await getAllComments(mockRequest, mockResponse);
    
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith([]);
        });
    

    });
    
});
