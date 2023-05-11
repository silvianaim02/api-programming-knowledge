import CustomError from '../errors/index.js';
import UserModel from '../models/User.js';

const memberValidate = async (req, res, next) => {
  const user = await UserModel.findOne({ _id: req.user.userId }).select(
    '-password'
  );
  // kalo akun tidak premium maka tidak diizinkan akses question
  if (!user.isPremiumMember) {
    throw new CustomError.UnauthorizedError(
      'Unauthorized to access assessment, you must be subscriber to access the assessment'
    );
  }

  next();
};

export { memberValidate };
