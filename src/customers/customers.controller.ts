import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';

@ApiTags('customers')
@Controller('customers')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '새 고객 등록' })
  @ApiBody({ type: CreateCustomerDto })
  @ApiResponse({
    status: 201,
    description: '고객이 성공적으로 등록되었습니다.',
    type: Customer,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 데이터입니다.',
  })
  @ApiResponse({
    status: 409,
    description: '이미 등록된 이메일입니다.',
  })
  async create(@Body() createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  @ApiOperation({ summary: '모든 고객 조회' })
  @ApiResponse({
    status: 200,
    description: '고객 목록 조회 성공',
    type: [Customer],
  })
  async findAll(): Promise<Customer[]> {
    return this.customersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 고객 조회' })
  @ApiParam({
    name: 'id',
    description: '고객 ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: '고객 조회 성공',
    type: Customer,
  })
  @ApiResponse({
    status: 404,
    description: '고객을 찾을 수 없습니다.',
  })
  async findOne(@Param('id') id: string): Promise<Customer> {
    return this.customersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '고객 정보 수정' })
  @ApiParam({
    name: 'id',
    description: '고객 ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({ type: UpdateCustomerDto })
  @ApiResponse({
    status: 200,
    description: '고객 정보가 성공적으로 수정되었습니다.',
    type: Customer,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 데이터입니다.',
  })
  @ApiResponse({
    status: 404,
    description: '고객을 찾을 수 없습니다.',
  })
  @ApiResponse({
    status: 409,
    description: '이미 등록된 이메일입니다.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '고객 삭제' })
  @ApiParam({
    name: 'id',
    description: '고객 ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 204,
    description: '고객이 성공적으로 삭제되었습니다.',
  })
  @ApiResponse({
    status: 404,
    description: '고객을 찾을 수 없습니다.',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.customersService.remove(id);
  }
} 