import CustomError from '../errors/index.js';

const checkPermissions = (requestUser, resourceUserId) => {
  console.log(requestUser._id.toString());
  console.log(resourceUserId.toString());
  if (requestUser.role === 'superadmin' || requestUser.role === 'admin') return;
  if (requestUser._id.toString() === resourceUserId.toString()) return;
  throw new CustomError.UnauthorizedError(
    'Not authorized to access this route'
  );
};

export { checkPermissions };
