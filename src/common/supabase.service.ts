import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private supabase: SupabaseClient | null = null;
  private readonly logger = new Logger(SupabaseService.name);
  private isInitialized = false;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    this.logger.log('🔍 환경변수 확인 중...');
    this.logger.log(`SUPABASE_URL: ${supabaseUrl ? '✅ 설정됨' : '❌ 누락'}`);
    this.logger.log(`SUPABASE_SERVICE_ROLE_KEY: ${supabaseKey ? '✅ 설정됨' : '❌ 누락'}`);

    if (!supabaseUrl || !supabaseKey) {
      this.logger.error('❌ Supabase 환경변수가 설정되지 않았습니다.');
      this.logger.error('필요한 환경변수: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
      this.logger.warn('⚠️ Supabase 연결 없이 서버를 시작합니다. 데이터베이스 기능이 작동하지 않습니다.');
      return;
    }

    try {
      this.supabase = createClient(supabaseUrl, supabaseKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });

      this.isInitialized = true;
      this.logger.log('✅ Supabase 연결 초기화 완료');
      
      // 연결 테스트
      await this.testConnection();
    } catch (error) {
      this.logger.error('❌ Supabase 초기화 실패:', error);
    }
  }

  getClient(): SupabaseClient {
    if (!this.supabase || !this.isInitialized) {
      throw new Error('Supabase가 초기화되지 않았습니다. 환경변수를 확인하세요.');
    }
    return this.supabase;
  }

  isConnected(): boolean {
    return this.isInitialized && this.supabase !== null;
  }

  // 연결 테스트 메서드
  async testConnection(): Promise<boolean> {
    if (!this.supabase) {
      this.logger.warn('⚠️ Supabase 클라이언트가 초기화되지 않음');
      return false;
    }

    try {
      const { data, error } = await this.supabase
        .from('customers')
        .select('count')
        .limit(1);

      if (error) {
        this.logger.error('❌ Supabase 연결 테스트 실패:', error.message);
        return false;
      }

      this.logger.log('✅ Supabase 연결 테스트 성공');
      return true;
    } catch (error) {
      this.logger.error('❌ Supabase 연결 오류:', error instanceof Error ? error.message : error);
      return false;
    }
  }
} 