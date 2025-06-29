import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { SupabaseService } from './common/supabase.service';

@ApiTags('system')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly supabaseService: SupabaseService,
  ) {}

  @Get()
  @ApiOperation({
    summary: '기본 엔드포인트',
    description: '서버가 정상 작동하는지 확인하는 기본 엔드포인트입니다.',
  })
  @ApiResponse({
    status: 200,
    description: '서버 정상 작동',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'NestJS 고객 관리 시스템 API 서버가 정상 작동 중입니다!' },
      },
    },
  })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({
    summary: '서버 상태 확인',
    description: '서버와 데이터베이스 연결 상태를 확인합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '서버 상태 정보',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2023-01-01T00:00:00.000Z' },
        database: {
          type: 'object',
          properties: {
            supabase: { type: 'boolean', example: true },
            message: { type: 'string', example: '데이터베이스 연결 성공' },
          },
        },
      },
    },
  })
  async getHealth() {
    try {
      const isDbConnected = this.supabaseService.isConnected() 
        ? await this.supabaseService.testConnection()
        : false;

      const dbMessage = this.supabaseService.isConnected()
        ? (isDbConnected ? '데이터베이스 연결 성공' : '데이터베이스 연결 테스트 실패')
        : '환경변수 미설정으로 데이터베이스 연결 불가';

      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        database: {
          supabase: isDbConnected,
          message: dbMessage,
          configured: this.supabaseService.isConnected(),
        },
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        database: {
          supabase: false,
          message: `데이터베이스 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
          configured: false,
        },
      };
    }
  }
}
