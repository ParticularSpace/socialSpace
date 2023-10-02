const Post = require('../models/Post');
const User = require('../models/User');

// Mock example to add time decay factor
function timeDecay(post, currentTime) {
    const timeDiff = currentTime - new Date(post.createdAt).getTime();
    const decayFactor = Math.exp(-timeDiff / (1000 * 60 * 60 * 24 * 7));  // Decay over a week
    return post.likes.length * decayFactor;
}

async function generateFeed(userId, page = 1, pageSize = 10) {
    const user = await User.findById(userId);
    let posts = [];

    const skip = (page - 1) * pageSize;

    // Fetch posts based on user interests
    if (user && user.interests.length > 0) {
        posts = await Post.find({ hashtags: { $in: user.interests } })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(pageSize)
            .populate('likes')
            .populate({ path: 'likes.user' })
            .populate({ path: 'user' })
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    model: 'User'
                }
            })
            .exec();
    }

    // Remove posts the user has already liked
    posts = posts.filter(post => !post.likes.some(like => like.user._id.toString() === userId));

    // Apply time decay and sort
    const currentTime = new Date().getTime();
    posts.sort((a, b) => timeDecay(b, currentTime) - timeDecay(a, currentTime));

    // If posts are fewer than pageSize, fetch random posts to fill the gap
    if (posts.length < pageSize) {
        const randomPosts = await Post.aggregate([{ $sample: { size: pageSize - posts.length } }]);
        const randomPostIds = randomPosts.map(post => post._id);
        const populatedRandomPosts = await Post.find({ _id: { $in: randomPostIds } })
            .populate('likes')
            .populate({ path: 'likes.user' })
            .populate({ path: 'user' })
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    model: 'User'
                }
            })
            .exec();

        // Remove posts the user has already liked from random posts
        const filteredRandomPosts = populatedRandomPosts.filter(
            post => !post.likes.some(like => like.user._id.toString() === userId)
        );

        // Combine the two sets of posts
        posts = [...posts, ...filteredRandomPosts];
    }

    return posts;
}

module.exports = generateFeed;
