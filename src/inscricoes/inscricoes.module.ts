import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InscricoesService } from './inscricoes.service';
import { InscricoesController } from './inscricoes.controller';
import { Inscricao } from './entities/inscricao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inscricao])],
  controllers: [InscricoesController],
  providers: [InscricoesService],
  exports: [InscricoesService],
})
export class InscricoesModule {} 