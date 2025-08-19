import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { logger } from '@/lib/logger';

export async function GET() {
  const startTime = Date.now();
  
  try {
    // ตรวจสอบ database connection
    await db.select().from(users).limit(1);
    
    const responseTime = Date.now() - startTime;
    
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: {
        status: 'connected',
        responseTime: `${responseTime}ms`
      },
      version: process.env.npm_package_version || '0.1.0',
    };

    logger.info('Health check passed', healthData);
    
    return NextResponse.json(healthData, { status: 200 });
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    const healthData = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: {
        status: 'disconnected',
        responseTime: `${responseTime}ms`,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      version: process.env.npm_package_version || '0.1.0',
    };

    logger.error('Health check failed', error, healthData);
    
    return NextResponse.json(healthData, { status: 503 });
  }
}