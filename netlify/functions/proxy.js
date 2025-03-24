// netlify/functions/proxy.js
const axios = require('axios');

exports.handler = async (event) => {
  const targetUrl = `http://aa09e3ae27a144cd0aaf0fbce7f0ab1c-bcccf20eeb9b21bd.elb.ap-south-1.amazonaws.com${event.path.replace('/.netlify/functions/proxy', '')}`;

  try {
    const response = await axios({
      method: event.httpMethod,
      url: targetUrl,
      data: event.body ? JSON.parse(event.body) : null,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  } catch (error) {
    return {
      statusCode: error.response ? error.response.status : 500,
      body: JSON.stringify(error.response ? error.response.data : 'Proxy Error')
    };
  }
};