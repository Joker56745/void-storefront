import server from '../dist/server/index.js';
import {Readable} from 'node:stream';
import {pipeline} from 'node:stream/promises';

function createRemixRequest(req, res) {
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const url = new URL(`${protocol}://${host}${req.url}`);

  const controller = new AbortController();
  res.on('close', () => {
    if (!res.writableFinished) {
      controller.abort();
    }
  });

  const init = {
    method: req.method,
    headers: req.headers,
    signal: controller.signal,
  };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = req;
    init.duplex = 'half';
  }

  return new Request(url.href, init);
}

async function sendNodeResponse(nodeResponse, res) {
  res.statusMessage = nodeResponse.statusText;
  res.writeHead(
    nodeResponse.status,
    nodeResponse.statusText,
    Object.fromEntries(nodeResponse.headers.entries()),
  );

  if (nodeResponse.body) {
    await pipeline(Readable.fromWeb(nodeResponse.body), res);
  } else {
    res.end();
  }
}

export default async function handleRequest(req, res) {
  const request = createRemixRequest(req, res);
  const env = process.env;
  const executionContext = {waitUntil: (promise) => promise};
  const response = await server.fetch(request, env, executionContext);
  await sendNodeResponse(response, res);
}
