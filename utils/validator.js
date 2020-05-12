import { check } from 'express-validator'

/* Validates and Normalizes user before creation. */
const validateUser = [
  check('password').isLength({ min: 8, max: 128 }),
  check('confirmedPassword').isLength({ min: 8, max: 128 }),
  check('username').isLength({ min: 2, max: 32 }),
  check('firstName').not().isEmpty(),
  check('lastName').not().isEmpty()
]

const validateSnippet = [
  check('description').not().isEmpty(),
  check('tags').not().isEmpty(),
  check('language').not().isEmpty()
]

export { validateUser, validateSnippet }
