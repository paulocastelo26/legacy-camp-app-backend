import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inscricao } from './entities/inscricao.entity';
import { CreateInscricaoDto } from './dto/create-inscricao.dto';
import { UpdateInscricaoDto } from './dto/update-inscricao.dto';
import * as XLSX from 'xlsx';

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

  async exportToExcel(): Promise<Buffer> {
    const inscricoes = await this.findAll();
    
    // Preparar os dados para o Excel
    const excelData = inscricoes.map(inscricao => ({
      'ID': inscricao.id,
      'Nome Completo': inscricao.fullName,
      'Data de Nascimento': inscricao.birthDate ? new Date(inscricao.birthDate).toLocaleDateString('pt-BR') : '',
      'Idade': inscricao.age,
      'Gênero': inscricao.gender,
      'Telefone': inscricao.phone,
      'Email': inscricao.email,
      'Endereço': inscricao.address,
      'Rede Social': inscricao.socialMedia,
      'Nome Contato Emergência': inscricao.emergencyContactName,
      'Telefone Contato Emergência': inscricao.emergencyContactPhone,
      'Parentesco Contato Emergência': inscricao.emergencyContactRelationship,
      'É Membro da Lagoinha': inscricao.isLagoinhaMember,
      'Nome da Igreja': inscricao.churchName,
      'Participação em Ministérios': inscricao.ministryParticipation,
      'Lote de Inscrição': inscricao.registrationLot,
      'Método de Pagamento': inscricao.paymentMethod,
      'Comprovante de Pagamento': inscricao.paymentProof,
      'Código do Cupom': inscricao.couponCode,
      'Tamanho da Camisa': inscricao.shirtSize,
      'Tem Alergia': inscricao.hasAllergy,
      'Detalhes da Alergia': inscricao.allergyDetails,
      'Usa Medicação': inscricao.usesMedication,
      'Detalhes da Medicação': inscricao.medicationDetails,
      'Restrição Alimentar': inscricao.dietaryRestriction,
      'Tem Teste de Ministério': inscricao.hasMinistryTest,
      'Resultados do Teste': inscricao.ministryTestResults,
      'Pedido de Oração': inscricao.prayerRequest,
      'Autorização de Imagem': inscricao.imageAuthorization ? 'Sim' : 'Não',
      'Consciência de Análise': inscricao.analysisAwareness ? 'Sim' : 'Não',
      'Consciência dos Termos': inscricao.termsAwareness ? 'Sim' : 'Não',
      'Declaração de Verdade': inscricao.truthDeclaration ? 'Sim' : 'Não',
      'Status': inscricao.status,
      'Data de Criação': inscricao.createdAt ? new Date(inscricao.createdAt).toLocaleString('pt-BR') : '',
      'Data de Atualização': inscricao.updatedAt ? new Date(inscricao.updatedAt).toLocaleString('pt-BR') : '',
    }));

    // Criar workbook e worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Configurar largura das colunas
    const columnWidths = [
      { wch: 5 },   // ID
      { wch: 25 },  // Nome Completo
      { wch: 15 },  // Data de Nascimento
      { wch: 8 },   // Idade
      { wch: 10 },  // Gênero
      { wch: 15 },  // Telefone
      { wch: 30 },  // Email
      { wch: 40 },  // Endereço
      { wch: 20 },  // Rede Social
      { wch: 25 },  // Nome Contato Emergência
      { wch: 20 },  // Telefone Contato Emergência
      { wch: 20 },  // Parentesco Contato Emergência
      { wch: 20 },  // É Membro da Lagoinha
      { wch: 25 },  // Nome da Igreja
      { wch: 30 },  // Participação em Ministérios
      { wch: 15 },  // Lote de Inscrição
      { wch: 20 },  // Método de Pagamento
      { wch: 25 },  // Comprovante de Pagamento
      { wch: 15 },  // Código do Cupom
      { wch: 15 },  // Tamanho da Camisa
      { wch: 12 },  // Tem Alergia
      { wch: 30 },  // Detalhes da Alergia
      { wch: 15 },  // Usa Medicação
      { wch: 30 },  // Detalhes da Medicação
      { wch: 20 },  // Restrição Alimentar
      { wch: 20 },  // Tem Teste de Ministério
      { wch: 30 },  // Resultados do Teste
      { wch: 40 },  // Pedido de Oração
      { wch: 20 },  // Autorização de Imagem
      { wch: 20 },  // Consciência de Análise
      { wch: 20 },  // Consciência dos Termos
      { wch: 20 },  // Declaração de Verdade
      { wch: 15 },  // Status
      { wch: 20 },  // Data de Criação
      { wch: 20 },  // Data de Atualização
    ];
    
    worksheet['!cols'] = columnWidths;

    // Adicionar worksheet ao workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inscrições');

    // Gerar buffer do arquivo Excel
    const excelBuffer = XLSX.write(workbook, { 
      type: 'buffer', 
      bookType: 'xlsx',
      compression: true 
    });

    return excelBuffer;
  }
} 