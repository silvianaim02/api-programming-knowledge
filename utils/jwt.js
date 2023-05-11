import jwt from 'jsonwebtoken';

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });

  return token;
};

const isTokenValid = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);

const attachCookiesToResponse = ({ res, user, domainName }) => {
  // create jwt - jwt.sign(payload,secret,options) tapi alternativenya dengan createJWT tinggal kirim payload
  const token = createJWT({ payload: user });

  // tanggal expired
  const oneHour = 1000 * 60 * 60 * 24;

  console.log(domainName);
  // attcah token ke response
  res.cookie('token', token, {
    // Cookie HttpOnly adalah tag yang ditambahkan ke cookie browser yang mencegah skrip sisi klien mengakses data.
    httpOnly: true,
    expires: new Date(Date.now() + oneHour),
    domain:
      process.env.NODE_ENV === 'production' ? `${domainName}` : 'localhost',
    sameSite: process.env.NODE_ENV === 'production' && 'none',
    secure: process.env.NODE_ENV === 'production' ? true : false,
    signed: true,
  });
};

export { createJWT, isTokenValid, attachCookiesToResponse };
