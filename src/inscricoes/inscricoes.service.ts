import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inscricao } from './entities/inscricao.entity';
import { CreateInscricaoDto } from './dto/create-inscricao.dto';
import { UpdateInscricaoDto } from './dto/update-inscricao.dto';

@Injectable()
export class InscricoesService {
  constructor(
    @InjectRepository(Inscricao)
    private inscricaoRepository: Repository<Inscricao>,
  ) {}

  async create(createInscricaoDto: CreateInscricaoDto): Promise<Inscricao> {
    // Converter a data de string para Date
    const inscricao = this.inscricaoRepository.create({
      ...createInscricaoDto,
      birthDate: new Date(createInscricaoDto.birthDate),
    });

    return await this.inscricaoRepository.save(inscricao);
  }

  async findAll(): Promise<Inscricao[]> {
    return await this.inscricaoRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Inscricao> {
    const inscricao = await this.inscricaoRepository.findOne({ where: { id } });
    if (!inscricao) {
      throw new NotFoundException(`Inscrição com ID ${id} não encontrada`);
    }
    return inscricao;
  }

  async update(id: number, updateInscricaoDto: UpdateInscricaoDto): Promise<Inscricao> {
    const inscricao = await this.findOne(id);
    
    // Se houver data de nascimento, converter para Date
    if (updateInscricaoDto.birthDate) {
      updateInscricaoDto.birthDate = new Date(updateInscricaoDto.birthDate).toISOString();
    }

    Object.assign(inscricao, updateInscricaoDto);
    return await this.inscricaoRepository.save(inscricao);
  }

  async remove(id: number): Promise<void> {
    const inscricao = await this.findOne(id);
    await this.inscricaoRepository.remove(inscricao);
  }

  async updateStatus(id: number, status: string): Promise<Inscricao> {
    const inscricao = await this.findOne(id);
    inscricao.status = status;
    return await this.inscricaoRepository.save(inscricao);
  }

  async findByStatus(status: string): Promise<Inscricao[]> {
    return await this.inscricaoRepository.find({
      where: { status },
      order: { createdAt: 'DESC' },
    });
  }

  async getStats(): Promise<any> {
    const total = await this.inscricaoRepository.count();
    const pendentes = await this.inscricaoRepository.count({ where: { status: 'PENDENTE' } });
    const aprovadas = await this.inscricaoRepository.count({ where: { status: 'APROVADA' } });
    const rejeitadas = await this.inscricaoRepository.count({ where: { status: 'REJEITADA' } });

    return {
      total,
      pendentes,
      aprovadas,
      rejeitadas,
    };
  }

  async getCountByCoupon(couponCode: string): Promise<number> {
    return await this.inscricaoRepository.count({
      where: { couponCode },
    });
  }
} 