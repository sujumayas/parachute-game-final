// netlify/functions/corsHandler.js
function corsHandler(handler) {
  return async (event, context) => {
    const response = await handler(event, context);
    return {
      ...response,
      headers: {
        ...response.headers,
        'Access-Control-Allow-Origin': '*', // Be more specific in production
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      },
    };
  };
}

module.exports = corsHandler;
