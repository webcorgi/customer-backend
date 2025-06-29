import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { SupabaseService } from '../common/supabase.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  private ensureSupabaseConnected() {
    if (!this.supabaseService.isConnected()) {
      throw new HttpException(
        {
          error: 'Database connection error',
          message: 'Supabase 연결이 설정되지 않았습니다. 환경변수를 확인하세요.',
          statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  // 모든 고객 조회
  async findAll(): Promise<Customer[]> {
    try {
      this.ensureSupabaseConnected();
      
      const { data, error } = await this.supabaseService
        .getClient()
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error('고객 목록 조회 실패:', error);
        throw new HttpException(
          {
            error: 'Database query failed',
            message: '고객 목록을 조회하는데 실패했습니다.',
            details: error.message,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return data || [];
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error('고객 목록 조회 중 예상치 못한 오류:', error);
      throw new HttpException(
        {
          error: 'Unexpected error',
          message: '고객 목록 조회 중 오류가 발생했습니다.',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 특정 고객 조회
  async findOne(id: string): Promise<Customer> {
    try {
      this.ensureSupabaseConnected();

      const { data, error } = await this.supabaseService
        .getClient()
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new HttpException(
            {
              error: 'Customer not found',
              message: `ID ${id}에 해당하는 고객을 찾을 수 없습니다.`,
              statusCode: HttpStatus.NOT_FOUND,
            },
            HttpStatus.NOT_FOUND,
          );
        }

        this.logger.error('고객 조회 실패:', error);
        throw new HttpException(
          {
            error: 'Database query failed',
            message: '고객 정보를 조회하는데 실패했습니다.',
            details: error.message,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error('고객 조회 중 예상치 못한 오류:', error);
      throw new HttpException(
        {
          error: 'Unexpected error',
          message: '고객 조회 중 오류가 발생했습니다.',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 고객 생성
  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    try {
      this.ensureSupabaseConnected();

      // 이메일 중복 체크
      const { data: existingCustomer } = await this.supabaseService
        .getClient()
        .from('customers')
        .select('id')
        .eq('email', createCustomerDto.email)
        .single();

      if (existingCustomer) {
        throw new HttpException(
          {
            error: 'Email already exists',
            message: `이메일 ${createCustomerDto.email}은 이미 사용 중입니다.`,
            statusCode: HttpStatus.CONFLICT,
          },
          HttpStatus.CONFLICT,
        );
      }

      const { data, error } = await this.supabaseService
        .getClient()
        .from('customers')
        .insert([
          {
            name: createCustomerDto.name,
            email: createCustomerDto.email,
            phone: createCustomerDto.phone || null,
          },
        ])
        .select()
        .single();

      if (error) {
        this.logger.error('고객 생성 실패:', error);
        throw new HttpException(
          {
            error: 'Database insert failed',
            message: '고객 등록에 실패했습니다.',
            details: error.message,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      this.logger.log(`새 고객 생성 완료: ${data.name} (${data.email})`);
      return data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error('고객 생성 중 예상치 못한 오류:', error);
      throw new HttpException(
        {
          error: 'Unexpected error',
          message: '고객 생성 중 오류가 발생했습니다.',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 고객 수정
  async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    try {
      this.ensureSupabaseConnected();

      // 고객 존재 여부 확인
      const { data: existingCustomer } = await this.supabaseService
        .getClient()
        .from('customers')
        .select('id, email')
        .eq('id', id)
        .single();

      if (!existingCustomer) {
        throw new HttpException(
          {
            error: 'Customer not found',
            message: `ID ${id}에 해당하는 고객을 찾을 수 없습니다.`,
            statusCode: HttpStatus.NOT_FOUND,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      // 이메일 변경 시 중복 체크
      if (updateCustomerDto.email && updateCustomerDto.email !== existingCustomer.email) {
        const { data: emailExists } = await this.supabaseService
          .getClient()
          .from('customers')
          .select('id')
          .eq('email', updateCustomerDto.email)
          .neq('id', id)
          .single();

        if (emailExists) {
          throw new HttpException(
            {
              error: 'Email already exists',
              message: `이메일 ${updateCustomerDto.email}은 이미 다른 고객이 사용 중입니다.`,
              statusCode: HttpStatus.CONFLICT,
            },
            HttpStatus.CONFLICT,
          );
        }
      }

      const updateData: any = {};
      if (updateCustomerDto.name !== undefined) updateData.name = updateCustomerDto.name;
      if (updateCustomerDto.email !== undefined) updateData.email = updateCustomerDto.email;
      if (updateCustomerDto.phone !== undefined) updateData.phone = updateCustomerDto.phone || null;

      const { data, error } = await this.supabaseService
        .getClient()
        .from('customers')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        this.logger.error('고객 수정 실패:', error);
        throw new HttpException(
          {
            error: 'Database update failed',
            message: '고객 정보 수정에 실패했습니다.',
            details: error.message,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      this.logger.log(`고객 정보 수정 완료: ${data.name} (${data.email})`);
      return data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error('고객 수정 중 예상치 못한 오류:', error);
      throw new HttpException(
        {
          error: 'Unexpected error',
          message: '고객 수정 중 오류가 발생했습니다.',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 고객 삭제
  async remove(id: string): Promise<void> {
    try {
      this.ensureSupabaseConnected();

      const { error } = await this.supabaseService
        .getClient()
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) {
        this.logger.error('고객 삭제 실패:', error);
        throw new HttpException(
          {
            error: 'Database delete failed',
            message: '고객 삭제에 실패했습니다.',
            details: error.message,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      this.logger.log(`고객 삭제 완료: ID ${id}`);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error('고객 삭제 중 예상치 못한 오류:', error);
      throw new HttpException(
        {
          error: 'Unexpected error',
          message: '고객 삭제 중 오류가 발생했습니다.',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
} 