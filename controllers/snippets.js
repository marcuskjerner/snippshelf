import Snippet from '../models/Snippet'

/**
 * Renders a view with snippets.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const getSnippets = async (req, res) => {
  try {
    const query = {
      id: req.params.id ? req.params.id : null
    }
    const snippets = await Snippet.find(query).lean()

    const data = { snippets }

    res.status(200).render('snippets', data)
  } catch (err) {
    console.error(err)
  }
}

/**
 * Renders a view with one snippet.
 * Queried by userID from params.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const getSnippet = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id).lean()

    const data = { snippets: [snippet] }

    res.status(200).render('snippet', data)
  } catch (err) {
    console.error(err)
  }
}
/**
 * Renders the newSnippet view.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const getCreateSnippetView = async (req, res) => {
  res.render('newSnippet')
}

/**
 * Returns X amount of snippets from database.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {number} numSnippets - The number of snippets to return.
 */
const getXLatest = async (req, res, numSnippets = 3) => {
  try {
    const snippets = await Snippet.find({})
      .sort([['updatedAt', 'asc']])
      .lean()

    const recent = snippets.slice(0, numSnippets)
    const data = { snippets: recent }
    return data
  } catch (err) {
    console.error(err)
  }
}

/**
 * Saves a new user to the database.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const snippetFormHandler = async (req, res) => {
  const {
    description,
    tags,
    programmingLanguage,
    snippetTextArea,
    author
  } = req.body

  if (!author) {
    return res.send('No Author.')
  }
  try {
    const newSnippet = new Snippet({
      description,
      tags,
      programmingLanguage,
      snippet: snippetTextArea,
      author
    })

    await newSnippet.save()
    req.session.flash = {
      type: 'success',
      text: `${description} was created successfully.`
    }
    res.status(201).redirect(`/users/${req.session.userId}/snippets`)
  } catch (err) {
    res.status(500).redirect('/')
  }
}

/**
 * Deletes a snippet by it's ID.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const deleteSnippet = async (req, res) => {
  try {
    const delItem = await Snippet.findByIdAndDelete(req.params.id)
    req.session.flash = {
      type: 'success',
      text: `${await delItem.description} was deleted successfully.`
    }
    res.status(200).redirect(`/users/${req.session.userId}/snippets`)
  } catch (err) {
    console.error(err)
  }
}

/**
 * Gets snippets created by a specific user.
 * Queried by userId from session.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const getUserSnippets = async (req, res) => {
  const snippets = await Snippet.find({ author: req.session.userId })
    .sort([['updatedAt', 'desc']])
    .lean()

  const data = { snippets }
  res.render('userSnippets', data)
}

/**
 * Renders the updateSnippet view for specific Snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const getUpdateSnippetView = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id).lean()

    const data = { snippets: [snippet] }
    res.render('updateSnippet', data)
  } catch (err) {
    console.error(err)
  }
}

/**
 * Updates the Snippets data on database.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const updateSnippet = async (req, res) => {
  const { description, tags, snippetTextArea } = req.body

  const update = {
    description,
    tags,
    snippet: snippetTextArea
  }
  req.session.flash = {
    type: 'success',
    text: `${description} was updated successfully.`
  }
  res.status(200).redirect(`/users/${req.session.userId}/snippets`)
  try {
    await Snippet.findByIdAndUpdate(req.params.id, update)
  } catch (err) {
    req.session.flash = { type: 'danger', text: err }
    res.status(204).redirect('/')
  }
}

export {
  getSnippets,
  getSnippet,
  getCreateSnippetView,
  snippetFormHandler,
  getXLatest,
  deleteSnippet,
  getUserSnippets,
  getUpdateSnippetView,
  updateSnippet
}
