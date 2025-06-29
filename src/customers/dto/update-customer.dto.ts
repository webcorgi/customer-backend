import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateCustomerDto {
  @ApiProperty({
    description: '고객 이름',
    example: '홍길동',
    maxLength: 100,
    required: false
  })
  @IsOptional()
  @IsString({ message: '이름은 문자열이어야 합니다.' })
  @MaxLength(100, { message: '이름은 100자를 초과할 수 없습니다.' })
  name?: string;

  @ApiProperty({
    description: '이메일 주소',
    example: 'hong@example.com',
    required: false
  })
  @IsOptional()
  @IsEmail({}, { message: '올바른 이메일 형식을 입력해주세요.' })
  email?: string;

  @ApiProperty({
    description: '전화번호',
    example: '010-1234-5678',
    required: false,
    maxLength: 20
  })
  @IsOptional()
  @IsString({ message: '전화번호는 문자열이어야 합니다.' })
  @MaxLength(20, { message: '전화번호는 20자를 초과할 수 없습니다.' })
  phone?: string;
} 