import express from 'express'
import { validateUser } from '../utils/validator'
import {
  getRegistrationView,
  registerUser,
  loginUser,
  logoutUser
} from '../controllers/users'
import { getUserSnippets } from '../controllers/snippets'
import { redirectUserHome, redirectLogin } from '../middleware/redirect'
const router = express.Router()

router
  .route('/register')
  .get(getRegistrationView)
  .post(redirectUserHome, validateUser, registerUser)

router
  .route('/login')
  .post(redirectUserHome, loginUser)

router
  .route('/logout')
  .post(logoutUser)

router
  .route('/:username/snippets')
  .get(redirectLogin, getUserSnippets)

export default router
