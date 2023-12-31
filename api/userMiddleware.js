import jwt from 'jsonwebtoken';

export const validateToken = (req, res, next) => {
  // validate JWT and call next if present and valid, else return error
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if(!token) {
      return res.status(401).json({ error: 'Unauthorized action'})
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next()
  } catch (error) {
    if(error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token'})
    }

    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
};