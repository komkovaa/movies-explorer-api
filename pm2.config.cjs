module.exports = {
  apps: [
    {
      name: 'movies-backend',
      script: './app.js',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
