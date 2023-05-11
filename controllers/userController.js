import UserModel from '../models/User.js';
import { StatusCodes } from 'http-status-codes';

const showCurrentUser = async (req, res) => {
  const user = await UserModel.findOne({ _id: req.user.userId }).select(
    '-password'
  );
  res
    .status(StatusCodes.OK)
    .json({ status: 'success', msg: 'ok', data: { user: user } });
};

export { showCurrentUser };
