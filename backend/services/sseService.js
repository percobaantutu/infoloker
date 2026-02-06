/**
 * SSE (Server-Sent Events) Service
 * Manages real-time notification connections for users
 */

// Store active SSE connections by user ID
const clients = new Map();

// Only log in development
const isDev = process.env.NODE_ENV !== "production";
const log = (...args) => isDev && console.log(...args);

/**
 * Add a new SSE client connection
 * @param {string} userId - The user's ID
 * @param {Response} res - Express response object
 */
const addClient = (userId, res) => {
  // Close existing connection if any (one connection per user)
  if (clients.has(userId)) {
    const oldClient = clients.get(userId);
    oldClient.end();
  }
  clients.set(userId, res);
  log(`SSE: Client connected. Total clients: ${clients.size}`);
};

/**
 * Remove a client connection
 * @param {string} userId - The user's ID
 */
const removeClient = (userId) => {
  clients.delete(userId);
  log(`SSE: Client disconnected. Total clients: ${clients.size}`);
};

/**
 * Send notification to a specific user via SSE
 * @param {string} userId - The user's ID to send to
 * @param {object} notification - The notification data
 */
const sendToUser = (userId, notification) => {
  const userIdStr = userId.toString();
  const client = clients.get(userIdStr);
  
  if (client) {
    try {
      const data = JSON.stringify(notification);
      client.write(`event: notification\n`);
      client.write(`data: ${data}\n\n`);
      log(`SSE: Notification sent`);
      return true;
    } catch (error) {
      console.error(`SSE: Failed to send notification`, error);
      removeClient(userIdStr);
      return false;
    }
  }
  return false;
};

/**
 * Get count of active connections (for debugging)
 */
const getClientCount = () => clients.size;

module.exports = {
  addClient,
  removeClient,
  sendToUser,
  getClientCount,
};
