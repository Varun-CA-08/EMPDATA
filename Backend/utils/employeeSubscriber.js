// import { createClient } from 'redis';

// const subscriber = createClient({ url: process.env.REDIS_URL });

// subscriber.on('error', (err) => console.error('Redis Subscriber Error:', err));

// async function initSubscriber() {
//   await subscriber.connect();
//   await subscriber.subscribe('employee:add', (message) => {
//     try {
//       const data = JSON.parse(message);
//       console.log('Admin notified: New Employee Added →', data.name);
//     } catch (err) {
//       console.error('Error parsing employee:add message:', err);
//     }
//   });
// }

// export { subscriber, initSubscriber };



import { createClient } from 'redis';
import { emitEmployeeEvent } from './socketServer.js'; // import your Socket.IO emit function

const subscriber = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });

subscriber.on('error', (err) => console.error('Redis Subscriber Error:', err));

async function initSubscriber() {
  await subscriber.connect();

  // subscribe to the unified 'employee-events' channel where you publish create/update/delete
  await subscriber.subscribe('employee-events', (message) => {
    try {
      const event = JSON.parse(message);
      console.log('Admin notified:', event.type, '→', event.data.name || event.data._id);

      // Forward event to all connected Socket.IO clients
      emitEmployeeEvent(event);
    } catch (err) {
      console.error('Error parsing employee-events message:', err);
    }
  });
}

export { subscriber, initSubscriber };
