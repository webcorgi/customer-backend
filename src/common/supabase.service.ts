import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('SUPABASE_URL과 SUPABASE_SERVICE_ROLE_KEY가 필요합니다.');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    console.log('✅ Supabase 연결 초기화 완료');
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  // 연결 테스트 메서드
  async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await this.supabase
        .from('customers')
        .select('count')
        .limit(1);

      if (error) {
        console.error('❌ Supabase 연결 테스트 실패:', error);
        return false;
      }

      console.log('✅ Supabase 연결 테스트 성공');
      return true;
    } catch (error) {
      console.error('❌ Supabase 연결 오류:', error);
      return false;
    }
  }
} 