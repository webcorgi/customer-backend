import { ApiProperty } from '@nestjs/swagger';

export class Customer {
  @ApiProperty({ 
    description: '고객 ID',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  id: string;

  @ApiProperty({ 
    description: '고객 이름',
    example: '홍길동'
  })
  name: string;

  @ApiProperty({ 
    description: '이메일 주소',
    example: 'hong@example.com'
  })
  email: string;

  @ApiProperty({ 
    description: '전화번호',
    example: '010-1234-5678',
    required: false
  })
  phone?: string;

  @ApiProperty({ 
    description: '생성일시',
    example: '2024-01-01T00:00:00.000Z'
  })
  created_at: string;

  @ApiProperty({ 
    description: '수정일시',
    example: '2024-01-01T00:00:00.000Z'
  })
  updated_at: string;
} 