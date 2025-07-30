import { InscricoesService } from './inscricoes.service';
import { CreateInscricaoDto } from './dto/create-inscricao.dto';
import { UpdateInscricaoDto } from './dto/update-inscricao.dto';
import { Inscricao } from './entities/inscricao.entity';
export declare class InscricoesController {
    private readonly inscricoesService;
    constructor(inscricoesService: InscricoesService);
    create(createInscricaoDto: CreateInscricaoDto): Promise<Inscricao>;
    findAll(): Promise<Inscricao[]>;
    getStats(): Promise<any>;
    findByStatus(status: string): Promise<Inscricao[]>;
    findOne(id: string): Promise<Inscricao>;
    update(id: string, updateInscricaoDto: UpdateInscricaoDto): Promise<Inscricao>;
    updateStatus(id: string, status: string): Promise<Inscricao>;
    remove(id: string): Promise<void>;
}
