require('dotenv').config();

module.exports = {
  // 数据库配置
  database: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'love_match',
    port: process.env.DB_PORT || 3306
  },
  
  // 服务器配置
  server: {
    port: process.env.PORT || 3000
  }
}; 