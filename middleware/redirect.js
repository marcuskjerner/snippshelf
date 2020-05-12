/**
 * Redirects not authenticated user to start page.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect('/')
  } else {
    next()
  }
}

/**
 * Redirects logged in user to it's home page.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const redirectUserHome = (req, res, next) => {
  if (req.session.userId) {
    res.redirect(`/users/${req.session.username}/snippets`)
  } else {
    next()
  }
}

export { redirectLogin, redirectUserHome }
