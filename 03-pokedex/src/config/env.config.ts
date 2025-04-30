export const EnvConfig = () => ({
  evironment: process.env.NODE_ENV || 'dev',
  port: process.env.PORT || 3000,
  mongoDbUri: process.env.MONGODB_URI,
  defaultLimit: process.env.DEFAULT_LIMIT || 10,
});
