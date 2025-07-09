const express = require('express');
const cors = require('cors');
const config = require('./config');
const { testConnection, initTables } = require('./database');

// 路由
const bookingsRouter = require('./routes/bookings');
const authRouter = require('./routes/auth');


const app = express();

// 中間件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 靜態檔案服務
app.use(express.static('../'));

// API 路由
app.use('/api/bookings', bookingsRouter);
app.use('/api/auth', authRouter);


// 健康檢查端點
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Jumeirah Marsa Al Arab 後端服務運行中',
    timestamp: new Date().toISOString()
  });
});

// 錯誤處理中間件
app.use((err, req, res, next) => {
  console.error('伺服器錯誤:', err);
  res.status(500).json({
    success: false,
    message: '伺服器內部錯誤'
  });
});

// 404 處理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '找不到請求的資源'
  });
});

// 啟動伺服器
async function startServer() {
  try {
    // 測試資料庫連線
    await testConnection();
    
    // 初始化資料表
    await initTables();
    
    // 啟動伺服器
    app.listen(config.server.port, () => {
      console.log(`🚀 伺服器已啟動在 http://localhost:${config.server.port}`);
      console.log(`📊 健康檢查: http://localhost:${config.server.port}/health`);
      console.log(`🔗 API 端點: http://localhost:${config.server.port}/api`);
    });
  } catch (error) {
    console.error('❌ 伺服器啟動失敗:', error);
    process.exit(1);
  }
}

startServer(); 