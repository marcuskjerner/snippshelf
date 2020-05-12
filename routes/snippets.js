import express from 'express'
import { validateSnippet } from '../utils/validator'

import {
  getSnippets,
  getSnippet,
  getCreateSnippetView,
  snippetFormHandler,
  deleteSnippet,
  getUpdateSnippetView,
  updateSnippet
} from '../controllers/snippets'

const router = express.Router()

router.route('/').get(getSnippets)

router.route('/snippet/:id').get(getSnippet)

router.route('/snippet/delete/:id').get(deleteSnippet)

router
  .route('/snippet/update/:id')
  .get(getUpdateSnippetView)
  .post(updateSnippet)

router
  .route('/new')
  .get(getCreateSnippetView)
  .post(validateSnippet, snippetFormHandler)

export default router
