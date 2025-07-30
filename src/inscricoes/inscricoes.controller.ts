import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { InscricoesService } from './inscricoes.service';
import { CreateInscricaoDto } from './dto/create-inscricao.dto';
import { UpdateInscricaoDto } from './dto/update-inscricao.dto';
import { Inscricao } from './entities/inscricao.entity';

@ApiTags('inscricoes')
@Controller('inscricoes')
export class InscricoesController {
  constructor(private readonly inscricoesService: InscricoesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova inscrição' })
  @ApiResponse({ status: 201, description: 'Inscrição criada com sucesso', type: Inscricao })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(@Body() createInscricaoDto: CreateInscricaoDto): Promise<Inscricao> {
    return await this.inscricoesService.create(createInscricaoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as inscrições' })
  @ApiResponse({ status: 200, description: 'Lista de inscrições', type: [Inscricao] })
  async findAll(): Promise<Inscricao[]> {
    return await this.inscricoesService.findAll();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obter estatísticas das inscrições' })
  @ApiResponse({ status: 200, description: 'Estatísticas das inscrições' })
  async getStats(): Promise<any> {
    return await this.inscricoesService.getStats();
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Listar inscrições por status' })
  @ApiParam({ name: 'status', description: 'Status das inscrições' })
  @ApiResponse({ status: 200, description: 'Lista de inscrições por status', type: [Inscricao] })
  async findByStatus(@Param('status') status: string): Promise<Inscricao[]> {
    return await this.inscricoesService.findByStatus(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar inscrição por ID' })
  @ApiParam({ name: 'id', description: 'ID da inscrição' })
  @ApiResponse({ status: 200, description: 'Inscrição encontrada', type: Inscricao })
  @ApiResponse({ status: 404, description: 'Inscrição não encontrada' })
  async findOne(@Param('id') id: string): Promise<Inscricao> {
    return await this.inscricoesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar inscrição' })
  @ApiParam({ name: 'id', description: 'ID da inscrição' })
  @ApiResponse({ status: 200, description: 'Inscrição atualizada com sucesso', type: Inscricao })
  @ApiResponse({ status: 404, description: 'Inscrição não encontrada' })
  async update(
    @Param('id') id: string,
    @Body() updateInscricaoDto: UpdateInscricaoDto,
  ): Promise<Inscricao> {
    return await this.inscricoesService.update(+id, updateInscricaoDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Atualizar status da inscrição' })
  @ApiParam({ name: 'id', description: 'ID da inscrição' })
  @ApiResponse({ status: 200, description: 'Status atualizado com sucesso', type: Inscricao })
  @ApiResponse({ status: 404, description: 'Inscrição não encontrada' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ): Promise<Inscricao> {
    return await this.inscricoesService.updateStatus(+id, status);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover inscrição' })
  @ApiParam({ name: 'id', description: 'ID da inscrição' })
  @ApiResponse({ status: 204, description: 'Inscrição removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Inscrição não encontrada' })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.inscricoesService.remove(+id);
  }
} 