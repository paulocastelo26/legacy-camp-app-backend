import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('inscricoes')
export class Inscricao {
  @PrimaryGeneratedColumn()
  id: number;

  // Informações Pessoais
  @Column({ length: 255 })
  fullName: string;

  @Column({ type: 'date' })
  birthDate: Date;

  @Column({ type: 'int' })
  age: number;

  @Column({ length: 20 })
  gender: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ length: 255 })
  email: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ length: 255 })
  socialMedia: string;

  // Contato de Emergência
  @Column({ length: 255 })
  emergencyContactName: string;

  @Column({ length: 20 })
  emergencyContactPhone: string;

  @Column({ length: 100 })
  emergencyContactRelationship: string;

  // Informações de Igreja
  @Column({ length: 10 })
  isLagoinhaMember: string;

  @Column({ length: 255 })
  churchName: string;

  @Column({ type: 'text' })
  ministryParticipation: string;

  // Informações da Inscrição
  @Column({ length: 20 })
  registrationLot: string;

  @Column({ length: 20 })
  paymentMethod: string;

  @Column({ length: 255, nullable: true })
  paymentProof: string;

  @Column({ length: 50, nullable: true })
  couponCode: string;

  // Informações Adicionais
  @Column({ length: 10 })
  shirtSize: string;

  @Column({ length: 10 })
  hasAllergy: string;

  @Column({ type: 'text', nullable: true })
  allergyDetails: string;

  @Column({ length: 10, nullable: true })
  usesMedication: string;

  @Column({ type: 'text', nullable: true })
  medicationDetails: string;

  @Column({ length: 50, default: 'Nenhuma' })
  dietaryRestriction: string;

  // Enfoque e Cuidado
  @Column({ length: 10 })
  hasMinistryTest: string;

  @Column({ type: 'text', nullable: true })
  ministryTestResults: string;

  @Column({ type: 'text' })
  prayerRequest: string;

  // Termos e Autorização
  @Column({ type: 'boolean', default: false })
  imageAuthorization: boolean;

  @Column({ type: 'boolean', default: false })
  analysisAwareness: boolean;

  @Column({ type: 'boolean', default: false })
  termsAwareness: boolean;

  @Column({ type: 'boolean', default: false })
  truthDeclaration: boolean;

  // Status da inscrição
  @Column({ length: 20, default: 'PENDENTE' })
  status: string;

  // Timestamps
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 