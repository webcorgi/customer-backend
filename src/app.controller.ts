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
  @ApiOperation({ summary: '서버 상태 확인' })
  @ApiResponse({ status: 200, description: '서버가 정상 작동 중입니다.' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: '시스템 헬스체크' })
  @ApiResponse({
    status: 200,
    description: '시스템 상태가 정상입니다.',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        database: {
          type: 'object',
          properties: {
            supabase: { type: 'boolean', example: true },
            message: { type: 'string', example: '데이터베이스 연결이 정상입니다.' },
          },
        },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  async getHealth() {
    try {
      const isDbConnected = await this.supabaseService.testConnection();

      return {
        status: isDbConnected ? 'ok' : 'error',
        database: {
          supabase: isDbConnected,
          message: isDbConnected
            ? '데이터베이스 연결이 정상입니다.'
            : '데이터베이스 연결에 실패했습니다.',
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        database: {
          supabase: false,
          message: '시스템 상태 확인 중 오류가 발생했습니다.',
        },
        timestamp: new Date().toISOString(),
      };
    }
  }
}
