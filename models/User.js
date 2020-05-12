import mongoose from 'mongoose'
const Schema = mongoose.Schema

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Please add a valid username'],
      trim: true,
      minlength: [3, 'Name can\'t be short than 3 characters.'],
      maxlength: [50, 'Name can\'t be longer than 50 characters.']
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, 'Name can\'t be short than 3 characters.'],
      maxlength: [50, 'Name can\'t be longer than 50 characters.']
    },
    hashedPassword: {
      type: String,
      min: [6, 'Minimum password length is 6 charcters.'] // Should be handled pre Model Creation
    },
    snippets: [{
      type: Schema.Types.ObjectId,
      ref: 'Snippet'
    }]
  },
  {
    timestamps: true
  }
)

export default mongoose.model('User', UserSchema)
