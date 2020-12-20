
export default {
  mongoose: {
    databaseUrl: process.env.DATABASE_URL || 'mongodb://localhost:27017/pomodoro',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    }
  }
};
