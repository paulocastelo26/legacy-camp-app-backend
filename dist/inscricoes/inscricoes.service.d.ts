import { Repository } from 'typeorm';
import { Inscricao } from './entities/inscricao.entity';
import { CreateInscricaoDto } from './dto/create-inscricao.dto';
import { UpdateInscricaoDto } from './dto/update-inscricao.dto';
export declare class InscricoesService {
    private inscricaoRepository;
    constructor(inscricaoRepository: Repository<Inscricao>);
    create(createInscricaoDto: CreateInscricaoDto): Promise<Inscricao>;
    findAll(): Promise<Inscricao[]>;
    findOne(id: number): Promise<Inscricao>;
    update(id: number, updateInscricaoDto: UpdateInscricaoDto): Promise<Inscricao>;
    remove(id: number): Promise<void>;
    updateStatus(id: number, status: string): Promise<Inscricao>;
    findByStatus(status: string): Promise<Inscricao[]>;
    getStats(): Promise<any>;
}
