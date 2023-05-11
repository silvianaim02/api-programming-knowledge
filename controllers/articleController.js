import { StatusCodes } from 'http-status-codes';
import CustomError from '../errors/index.js';
import ArticleModel from '../models/Article.js';

const createArticle = async (req, res) => {
  const { title, body, category } = req.body;

  if (!title) {
    throw new CustomError.BadRequestError('judul harus diisi');
  }
  if (!body) {
    throw new CustomError.BadRequestError('masukkan isi artikel!');
  }
  if (!category) {
    throw new CustomError.BadRequestError('masukkan minimal 1 kategori!');
  }

  const article = await ArticleModel.create({
    title,
    category,
    body,
    user: req.user.userId,
  });

  await article.save();

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    msg: 'create article success',
    data: { article },
  });
};

const getAllArticles = async (req, res) => {
  const articles = await ArticleModel.find().populate({
    path: 'user',
    select: 'name',
  });
  res.status(StatusCodes.OK).json({
    status: 'success',
    msg: 'ok',
    data: { articles },
  });
};

const getSingleArticle = async (req, res) => {
  const { id: articleId } = req.params;
  const article = await ArticleModel.findOne({ _id: articleId }).populate({
    path: 'user',
    select: 'name',
  });
  if (!article) {
    throw new CustomError.NotFoundError(`No order with id ${articleId}`);
  }
  res.status(StatusCodes.OK).json({
    status: 'success',
    msg: 'ok',
    data: { article },
  });
};

export { createArticle, getAllArticles, getSingleArticle };
