// netlify/functions/proxy.js
const axios = require('axios');

exports.handler = async (event) => {
  const targetUrl = `http://aa09e3ae27a144cd0aaf0fbce7f0ab1c-bcccf20eeb9b21bd.elb.ap-south-1.amazonaws.com${event.path.replace('/.netlify/functions/proxy', '')}`;

  try {
    console.log('Proxy Request Details:', {
      method: event.httpMethod,
      url: targetUrl,
      body: event.body,
      headers: event.headers
    });

    const response = await axios({
      method: event.httpMethod,
      url: targetUrl,
      data: event.body ? JSON.parse(event.body) : null,
      headers: {
        'Content-Type': 'application/json',
        ...event.headers // Forward original headers
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    };
  } catch (error) {
    console.error('Full Proxy Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });

    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({
        error: 'Proxy Error',
        details: error.message,
        targetUrl: targetUrl,
        originalError: error.response?.data
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  }
};

// Handle OPTIONS preflight requests
exports.handler.cors = true;