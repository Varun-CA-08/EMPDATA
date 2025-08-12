// import mongoose from 'mongoose';
// import app from './app.js';
// import { connectRedis } from './utils/redisClient.js'; // clean connection method
// import { initSubscriber } from './utils/employeeSubscriber.js'; // for Redis Pub/Sub

// const PORT = process.env.PORT || 5000;
// const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/employeeManagement';

// async function startServer() {
//   try {
//     // Connect to MongoDB
//     await mongoose.connect(MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('✅ MongoDB connected');

//     // Connect to Redis
//     await connectRedis();
//     console.log('✅ Redis connected');

//     // Initialize Redis subscriber for Pub/Sub notifications
//     await initSubscriber();

//     // Start server
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running at http://localhost:${PORT}`);
//     });
//   } catch (err) {
//     console.error('❌ Startup error:', err.message);
//     process.exit(1);
//   }
// }

// startServer();





import mongoose from 'mongoose';
import http from 'http';
import app from './app.js';
import { connectRedis } from './utils/redisClient.js';
import { initSubscriber } from './utils/employeeSubscriber.js';
import { initSocketServer } from './utils/socketServer.js';

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/employeeManagement';

async function startServer() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');

    // Connect to Redis
    await connectRedis();
    console.log('✅ Redis connected');

    // Create HTTP server using Express app
    const httpServer = http.createServer(app);

    // Initialize Socket.IO server with HTTP server
    initSocketServer(httpServer);

    // Initialize Redis subscriber to listen to employee-events channel
    await initSubscriber();

    // Start HTTP server
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('❌ Startup error:', err.message);
    process.exit(1);
  }
}

startServer();




