// middlewares/auth.middleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// التحقق من التوثيق
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: 'Error verifying token' });
      // console.log('Decoded JWT user:', user); // أضف هذا لتتبع التوكن
      req.userId = user.userId; // تأكد من أن `user.userid` هو الاسم الصحيح
      next();
  });
};

export default authenticateToken;