import CustomError from '../errors/index.js';
import UserModel from '../models/User.js';
import { isTokenValid } from '../utils/index.js';

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;

  // kalo token ngga ada

  if (!token) {
    throw new CustomError.UnauthenticatedError('Authentication invalid');
  }
  // kalo misal token ada try catch
  try {
    // payload ii hasil dari nge verify apakah token yag ada di cookies ini sama dengan JWT Secret
    const { name, userId, exp } = isTokenValid({ token });

    req.user = {
      name,
      userId,
      exp,
    };
    const user = await UserModel.findOne({ _id: req.user.userId }).select(
      '-password'
    );
    if (!user) {
      throw new CustomError.UnauthenticatedError('Authentication invalid');
    }
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError('Authentication invalid');
  }
};

const authorizePermissions = (...roles) => {
  return async (req, res, next) => {
    const user = await UserModel.findOne({ _id: req.user.userId }).select(
      '-password'
    );
    // apabila tidak ada user.role di array roles
    if (!roles.includes(user.role)) {
      throw new CustomError.UnauthorizedError(
        'Unauthorized to access the route'
      );
    }
    next();
  };
};

export { authenticateUser, authorizePermissions };
