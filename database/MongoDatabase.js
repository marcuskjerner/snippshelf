const mongoose = require('mongoose')

/** Class for Handling mongodb connection. */
export default class MongoDatabase {
  /**
   * Connects to and closes MongoDB.
   *
   * @param {string} connectionString - MongoDB Connection String.
   */
  constructor (connectionString) {
    this.uri = connectionString
    this.connection = null
  }

  /**
   * Tries to connect to Mongo using the provided connection string.
   *
   * @memberof MongoDatabase
   */
  async connect () {
    try {
      this.connection = await mongoose.connect(this.uri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
      })

      console.log(`MongoDB Connected: ${this.connection.connection.host}`)
    } catch (err) {
      console.error(err)
    }
  }

  /**
   * Closes the connection to mongo.
   *
   * @memberof MongoDatabase
   */
  async close () {
    await this.connection.close()
    console.log(`MongoDB on ${this.connection.connection.host} was closed.`)
  }
}
