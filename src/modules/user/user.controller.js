import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import {findUserByUsername } from '../../../Database/models/user.model.js';

const SHA1 = (password) => {
  return crypto.createHash('sha1').update(password).digest('hex');
};

export const loginUser = async (req, res) => {
  const { error } = req.body;
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { username, password } = req.body;

  try {
    // Username verification
    const user = await findUserByUsername(username);
    if (!user) {
      return res.status(400).json({ message: 'Incorrect username or password' });
    }

    // Password verification
    const hashedPassword = SHA1(password);
    if (hashedPassword !== user.password) {
      return res.status(400).json({ message: 'Incorrect username or password' });
    }

    // CREATE JWT
    const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.status(200).json({ message: 'Registration completed successfully', token });
  } catch (error) {
    res.status(500).json({ message: 'Error server', error });
  }
};