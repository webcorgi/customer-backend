import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { SupabaseService } from '../common/supabase.service';

@Module({
  controllers: [CustomersController],
  providers: [CustomersService, SupabaseService],
  exports: [CustomersService],
})
export class CustomersModule {} 