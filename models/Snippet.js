import mongoose from 'mongoose'
import slugify from 'slugify'
import programmingLanguages from '../database/programmingLanguages'

const SnippetSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, 'Please add a description'],
      trim: true,
      minlength: [3, "Name can't be short than 3 characters."],
      maxlength: [50, "Name can't be longer than 50 characters."]
    },
    slug: String,
    snippet: {
      type: String,
      trim: true,
      required: [true, 'Please add a snippet.'],
      maxlength: [2000, "The snippet can't be longer than 2000 characters"]
    },
    tags: [
      {
        type: String,
        trim: true,
        maxlength: [200, "Tags can't be longer than 200 characters."]
      }
    ],
    author: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true
    },
    programmingLanguage: {
      // IMPLEMENT IF TIME
      type: String,
      enum: programmingLanguages,
      default: 'express'
    }
  },
  {
    timestamps: true
  }
)

/**
 * Mongoose hook running before save.
 * Generates simplified slug from description.
 */
SnippetSchema.pre('save', async function () {
  try {
    this.slug = await slugify(this.description, {
      lower: true,
      remove: /[*+~.()'"!:@]/g
    })
  } catch (err) {
    console.error(err)
  }
})

export default mongoose.model('Snippet', SnippetSchema)
