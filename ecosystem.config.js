module.exports = {
  apps: [
    {
      name: 'backend',
      script: './backend-server.js',
      watch: false,
      instances: 1,
      exec_mode: 'fork',
      env: {
        BACKEND_PORT: 8000
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log'
    },
    {
      name: 'frontend',
      script: './server.js',
      watch: false,
      instances: 1,
      exec_mode: 'fork',
      env: {
        PORT: 3000
      },
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log'
    }
  ]
};
