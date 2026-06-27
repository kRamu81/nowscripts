import { Request, Response, NextFunction } from "express";

let totalResponseTime = 0;
let requestCount = 0;

export const performanceMonitor = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime();
  
  res.on("finish", () => {
    const diff = process.hrtime(start);
    const time = diff[0] * 1e3 + diff[1] * 1e-6; // in ms
    
    totalResponseTime += time;
    requestCount++;
    
    if (time > 500) {
      console.warn(`[SLOW API] ${req.method} ${req.originalUrl} - ${time.toFixed(2)}ms`);
    }
  });

  next();
};

export const getAverageResponseTime = () => {
  if (requestCount === 0) return 0;
  return totalResponseTime / requestCount;
};

// Reset metrics periodically if needed, or keep a rolling average.
setInterval(() => {
  // Simple rolling average reset every minute to keep it relevant to recent traffic
  totalResponseTime = totalResponseTime * 0.5;
  requestCount = requestCount * 0.5;
}, 60000);
