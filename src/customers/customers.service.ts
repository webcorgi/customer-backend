import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../common/supabase.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(private readonly supabaseService: SupabaseService) {}

  // 모든 고객 조회
  async findAll(): Promise<Customer[]> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('고객 목록 조회 오류:', error);
        throw new InternalServerErrorException('고객 목록을 불러오는데 실패했습니다.');
      }

      return data || [];
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      console.error('예상치 못한 오류:', error);
      throw new InternalServerErrorException('서버 내부 오류가 발생했습니다.');
    }
  }

  // 특정 고객 조회
  async findOne(id: string): Promise<Customer> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new NotFoundException(`ID ${id}에 해당하는 고객을 찾을 수 없습니다.`);
        }
        console.error('고객 조회 오류:', error);
        throw new InternalServerErrorException('고객 정보를 불러오는데 실패했습니다.');
      }

      return data;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      console.error('예상치 못한 오류:', error);
      throw new InternalServerErrorException('서버 내부 오류가 발생했습니다.');
    }
  }

  // 고객 생성
  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    try {
      // 중복 이메일 검사
      const { data: existingCustomer } = await this.supabaseService
        .getClient()
        .from('customers')
        .select('id')
        .eq('email', createCustomerDto.email)
        .single();

      if (existingCustomer) {
        throw new ConflictException('이미 등록된 이메일입니다.');
      }

      // 고객 생성
      const { data, error } = await this.supabaseService
        .getClient()
        .from('customers')
        .insert([
          {
            name: createCustomerDto.name.trim(),
            email: createCustomerDto.email.trim(),
            phone: createCustomerDto.phone?.trim() || null,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('고객 생성 오류:', error);
        throw new InternalServerErrorException('고객 등록에 실패했습니다.');
      }

      return data;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      console.error('예상치 못한 오류:', error);
      throw new InternalServerErrorException('서버 내부 오류가 발생했습니다.');
    }
  }

  // 고객 수정
  async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    try {
      // 고객 존재 확인
      await this.findOne(id);

      // 이메일 변경 시 중복 검사
      if (updateCustomerDto.email) {
        const { data: existingCustomer } = await this.supabaseService
          .getClient()
          .from('customers')
          .select('id')
          .eq('email', updateCustomerDto.email)
          .neq('id', id)
          .single();

        if (existingCustomer) {
          throw new ConflictException('이미 등록된 이메일입니다.');
        }
      }

      // 업데이트할 데이터 준비
      const updateData: any = {};
      if (updateCustomerDto.name !== undefined) {
        updateData.name = updateCustomerDto.name.trim();
      }
      if (updateCustomerDto.email !== undefined) {
        updateData.email = updateCustomerDto.email.trim();
      }
      if (updateCustomerDto.phone !== undefined) {
        updateData.phone = updateCustomerDto.phone?.trim() || null;
      }

      // 고객 정보 수정
      const { data, error } = await this.supabaseService
        .getClient()
        .from('customers')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('고객 수정 오류:', error);
        throw new InternalServerErrorException('고객 정보 수정에 실패했습니다.');
      }

      return data;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      console.error('예상치 못한 오류:', error);
      throw new InternalServerErrorException('서버 내부 오류가 발생했습니다.');
    }
  }

  // 고객 삭제
  async remove(id: string): Promise<void> {
    try {
      // 고객 존재 확인
      await this.findOne(id);

      const { error } = await this.supabaseService
        .getClient()
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('고객 삭제 오류:', error);
        throw new InternalServerErrorException('고객 삭제에 실패했습니다.');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      console.error('예상치 못한 오류:', error);
      throw new InternalServerErrorException('서버 내부 오류가 발생했습니다.');
    }
  }
} 