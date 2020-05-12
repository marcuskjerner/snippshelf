import User from '../models/User'
import { validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
/**
 * Renders register view.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const getRegistrationView = (req, res) => {
  res.render('users/register')
}
/**
 * Validates, creates & saves a new User to the database.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const registerUser = async (req, res) => {
  const {
    username,
    firstName,
    lastName,
    password,
    confirmedPassword
  } = req.body

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    req.session.flash = {
      type: 'warning',
      text: errors
    }
    res.redirect('/users/register')
  }
  if (password !== confirmedPassword) {
    req.session.flash = { type: 'warning', text: 'Password fields must match.' }
    res.redirect('/users/register')
    return
  }
  try {
    const userExists = await User.exists({ username: username })
    if (userExists) {
      req.session.flash = { type: 'warning', text: `A user with username ${username} is already registered.` }
      return res.redirect('/users/register')
    }
    // Generate salt and hashed password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      username,
      name: `${firstName} ${lastName}`,
      hashedPassword
    })
    req.session.userId = await newUser.id
    req.session.username = await newUser.username
    await newUser.save()
    req.session.flash = {
      type: 'success',
      text: `User ${username} was created successfully.`
    }
    req.session.userId = await newUser.id
    res.status(201).redirect(`/users/${req.session.userId}/snippets`)
  } catch (err) {
    req.session.flash = { type: 'danger', text: 'Oops, something went wrong. Please try again.' }
    res.status(500).redirect('/users/register')
  }
}
/**
 * Authenticates user and stores userId & username in session.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const loginUser = async (req, res) => {
  const { username, password } = req.body
  try {
    const user = await User.findOne({ username: username })
    if (!user) {
      req.session.flash = {
        type: 'warning',
        text: `No user with username ${username} could be found.`
      }
      return res.status(401).redirect('/')
    }
    bcrypt.compare(password, user.hashedPassword, function (err, result) {
      if (err) {
        throw new Error(err)
      }
      if (result) {
        req.session.userId = user.id
        req.session.username = user.username
        req.session.success = true
        res.status(200).render('home')
      } else {
        req.session.flash = {
          type: 'warning',
          text: 'Invalid password'
        }
        res.status(401).redirect('/')
      }
    })
  } catch (err) {
    req.session.flash = {
      type: 'warning',
      text: `No user with username ${username} could be found.`
    }
    res.status(500).redirect('/')
  }
}
/**
 * Logs out user by destroying the session and clearing cookies.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const logoutUser = async (req, res) => {
  try {
    const username = req.session.username
    await req.session.destroy()
    await res.clearCookie()

    req.session.flash = {
      type: 'success',
      text: `User ${username} was logged out.`
    }

    res.status(200).redirect('/')
  } catch (error) {
    return res.redirect('/')
  }
}

export { getRegistrationView, registerUser, loginUser, logoutUser }
