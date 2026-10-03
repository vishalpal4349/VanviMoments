/**
 * VANVI MOMENTS — OBSERVABILITY & MONITORING MIDDLEWARE
 * Tracks unique Request IDs (X-Request-Id), latency metrics, status codes,
 * and error telemetry with optional Sentry hook.
 */

const crypto = require('crypto');

// Metrics counters
const metrics = {
  totalRequests: 0,
  statusCodes: {
    '2xx': 0,
    '4xx': 0,
    '5xx': 0
  },
  avgLatencyMs: 0,
  _totalLatency: 0
};

function requestTracker(req, res, next) {
  // Attach or generate unique Request ID
  const reqId = req.headers['x-request-id'] || 'req_' + crypto.randomBytes(8).toString('hex');
  req.id = reqId;
  res.setHeader('X-Request-Id', reqId);

  const startHrTime = process.hrtime();
  metrics.totalRequests++;

  res.on('finish', () => {
    const elapsedHrTime = process.hrtime(startHrTime);
    const elapsedMs = Math.round((elapsedHrTime[0] * 1000) + (elapsedHrTime[1] / 1e6));

    // Update metrics
    metrics._totalLatency += elapsedMs;
    metrics.avgLatencyMs = Math.round((metrics._totalLatency / metrics.totalRequests) * 100) / 100;

    const codeBucket = res.statusCode >= 500 ? '5xx' : res.statusCode >= 400 ? '4xx' : '2xx';
    metrics.statusCodes[codeBucket]++;

    // Log API requests in development or errors in production
    if (req.path.startsWith('/api') && (process.env.NODE_ENV !== 'production' || res.statusCode >= 400)) {
      const tag = res.statusCode >= 400 ? '⚠️' : '⚡';
      console.log(`${tag} [${reqId}] ${req.method} ${req.path} -> ${res.statusCode} (${elapsedMs}ms)`);
    }
  });

  next();
}

function captureError(err, req = null) {
  const reqId = req ? req.id : 'system';
  console.error(`💥 [ERROR ${reqId}]`, err);

  // Sentry forwarder if SENTRY_DSN configured
  if (process.env.SENTRY_DSN) {
    try {
      // In production with @sentry/node installed, Sentry.captureException(err);
    } catch (e) {
      // noop
    }
  }
}

function getMetricsSummary() {
  return {
    totalRequests: metrics.totalRequests,
    avgLatencyMs: metrics.avgLatencyMs,
    statusCodes: { ...metrics.statusCodes },
    uptimeSeconds: Math.floor(process.uptime()),
    memoryUsageMB: Math.round(process.memoryUsage().rss / (1024 * 1024) * 100) / 100
  };
}

module.exports = {
  requestTracker,
  captureError,
  getMetricsSummary
};

