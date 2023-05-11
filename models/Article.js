import mongoose from 'mongoose';

const ArticleSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  category: {
    type: [String],
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  upVotes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Vote',
    default: [],
  },
  totalComments: {
    type: Number,
    default: 0,
  },
  articleType: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free',
  },
});

const ArticleModel = mongoose.model('Article', ArticleSchema);

export default ArticleModel;
