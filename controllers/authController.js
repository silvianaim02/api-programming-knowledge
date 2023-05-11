import UserModel from '../models/User.js';
import { StatusCodes } from 'http-status-codes';
import CustomError from '../errors/index.js';
import { attachCookiesToResponse } from '../utils/index.js';
import createTokenUser from '../utils/createTokenUser.js';

const register = async (req, res) => {
  const { email, name, password } = req.body;
  const emailAlreadyExists = await UserModel.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('Email already exist');
  }
  const isFirstAccount = (await UserModel.countDocuments({})) === 0;
  const role = isFirstAccount ? 'superadmin' : 'user';

  // mengirikan ke db
  const user = await UserModel.create({ email, name, password, role });

  const userObjectToken = {
    name: user.name,
    userId: user._id,
    role: user.role,
  };
  res.status(StatusCodes.CREATED).json({
    status: 'success',
    msg: 'success register',
    user: userObjectToken,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError('Please Provide Email and password');
  }

  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invaid Credentials');
  }

  // (tidak mencantumkan respon password (karena keamanan), tapi tetap password sudah kekirim)
  const userObjectToken = createTokenUser(user);
  // attch token
  attachCookiesToResponse({
    res,
    user: userObjectToken,
    domainName: req.hostname,
  });

  res.status(StatusCodes.OK).json({ status: 'success', msg: 'success login' });
};

const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 5 * 1000),
    sameSite: process.env.NODE_ENV === 'production' && 'none',
    secure: process.env.NODE_ENV === 'production' ? true : false,
    signed: true,
  });

  res.status(StatusCodes.OK).json({ status: 'success', msg: 'user logout' });
};

export { register, login, logout };
