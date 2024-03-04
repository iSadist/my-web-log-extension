const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/', createProxyMiddleware({ 
  target: 'https://www.myweblog.se', 
  changeOrigin: true,
  onProxyRes: function (proxyRes, req, res) {
    console.log('Incoming response:', proxyRes.headers);
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  }
}));

app.listen(3001);