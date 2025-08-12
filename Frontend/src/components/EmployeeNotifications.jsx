// import React, { useEffect, useState } from 'react';
// import { io } from 'socket.io-client';

// // Adjust this URL to match your backend server URL & port
// const SOCKET_SERVER_URL = 'http://localhost:4000';

// const socket = io(SOCKET_SERVER_URL);

// export default function EmployeeNotifications() {
//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     socket.on('employee-update', (event) => {
//       console.log('Received employee event:', event);

//       // Add new event on top of the notifications list
//       setNotifications(prev => [event, ...prev]);
//     });

//     // Cleanup socket event listener on unmount
//     return () => {
//       socket.off('employee-update');
//     };
//   }, []);

//   return (
//     <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
//       <h4>Employee Notifications</h4>
//       {notifications.length === 0 && <p>No notifications yet.</p>}
//       <ul>
//         {notifications.map((notif, idx) => (
//           <li key={idx}>
//             Employee <strong>{notif.type}</strong>: {notif.data.name} ({notif.data.email})
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:4000';
const socket = io(SOCKET_SERVER_URL);

export default function EmployeeNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    socket.on('employee-update', (event) => {
      setNotifications(prev => [event, ...prev]);
    });

    return () => {
      socket.off('employee-update');
    };
  }, []);

  // Decide which notifications to display
  const displayedNotifications = showAll ? notifications : notifications.slice(0, 1);

  return (
    <div
      style={{
        maxHeight: 200,
        overflowY: 'auto',
        border: '1px solid #ccc',
        padding: 10,
        width: '100%',      // full width of container
        borderRadius: 8,
        backgroundColor: '#fafafa',
        boxSizing: 'border-box',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      }}
    >
      <h4 style={{ marginBottom: 10 }}>Employee Notifications</h4>

      <button
        onClick={() => setShowAll(!showAll)}
        style={{ marginBottom: 10, cursor: 'pointer' }}
        aria-label={showAll ? 'Show only recent notification' : 'Show all notifications'}
      >
        {showAll ? '⬆️ Show Less' : '⬇️ Show All'}
      </button>

      {displayedNotifications.length === 0 && <p>No notifications yet.</p>}

      <ul style={{ paddingLeft: 20, margin: 0 }}>
        {displayedNotifications.map((notif, idx) => (
          <li
            key={idx}
            style={{
              whiteSpace: 'nowrap',       // keep single line
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              marginBottom: 6,
              listStyleType: 'disc',
              fontSize: 14,
            }}
            title={`Employee ${notif.type}: ${notif.data.name} (${notif.data.email})`} // tooltip for full text
          >
            Employee <strong>{notif.type}</strong>: {notif.data.name} ({notif.data.email})
          </li>
        ))}
      </ul>
    </div>
  );
}
