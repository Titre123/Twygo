import mongoose from 'mongoose';
import logger from '../logging/logger';

// DB class that wraps around the mongoose library to manage database connections
export default class DB {
  private uri: string; // The URI string used to connect to the database
  private db!: mongoose.Connection; // The mongoose Connection object, initialized to undefined

  constructor(uri: string) {
    this.uri = uri;
  }

  // Method to establish a connection to the database
  public async connect() {
    // Connect to the database using the provided URI string
    await mongoose.connect(this.uri);

    // Set the db property to the mongoose connection object
    this.db = mongoose.connection;

    // Set up event listeners for errors and successful connection
    this.db.on('error', (error) => {
      logger.error(error);
    });
    this.db.once('open', () => {
      logger.info('Connected to database');
    });
  }

  // Method to retrieve the mongoose connection object
  public connection() {
    return this.db;
  }
}
