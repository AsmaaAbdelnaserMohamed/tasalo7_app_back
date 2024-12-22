// routes/auth.routes.js
import express from 'express';
import { loginUser} from './user.controller.js';
// import authenticateToken from '../../middleware/auth.middleware.js';

const routerAuth = express.Router();


// login router
routerAuth.post('/login', loginUser);

export default routerAuth;
