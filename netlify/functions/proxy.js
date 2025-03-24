// netlify/functions/proxy.js
const axios = require('axios');
const querystring = require('querystring');

exports.handler = async (event) => {
  // Handle OPTIONS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      },
      body: ''
    };
  }

  const targetUrl = `http://aa09e3ae27a144cd0aaf0fbce7f0ab1c-bcccf20eeb9b21bd.elb.ap-south-1.amazonaws.com${event.path.replace('/.netlify/functions/proxy', '')}`;

  try {
    // Determine content type and parse body accordingly
    const contentType = event.headers['content-type'] || event.headers['Content-Type'] || '';
    let requestBody = null;

    if (contentType.includes('application/json')) {
      requestBody = event.body ? JSON.parse(event.body) : null;
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      requestBody = event.body ? querystring.parse(event.body) : null;
    }

    console.log('Proxy Request Details:', {
      method: event.httpMethod,
      path: event.path,
      targetUrl: targetUrl,
      contentType: contentType,
      body: requestBody,
      headers: event.headers
    });

    const response = await axios({
      method: event.httpMethod,
      url: targetUrl,
      data: requestBody,
      headers: {
        'Content-Type': contentType,
        ...Object.fromEntries(
          Object.entries(event.headers).filter(([key]) => 
            ['authorization', 'content-type'].includes(key.toLowerCase())
          )
        )
      },
      timeout: 10000, // 10 seconds timeout
      transformRequest: [
        (data, headers) => {
          // Custom transform for x-www-form-urlencoded
          if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
            return querystring.stringify(data);
          }
          return data;
        }
      ]
    });

    return {
      statusCode: response.status,
      body: JSON.stringify(response.data),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    };
  } catch (error) {
    console.error('Detailed Proxy Error:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers,
      requestUrl: targetUrl,
      requestMethod: event.httpMethod
    });

    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({
        error: 'Proxy Request Failed',
        message: error.message,
        details: {
          targetUrl: targetUrl,
          method: event.httpMethod,
          originalError: error.response?.data || 'No additional error details'
        }
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  }
};