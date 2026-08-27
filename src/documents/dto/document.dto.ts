import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  packages?: string;

  @IsString()
  theory: string;

  @IsString()
  codePractice: string;

  @IsOptional()
  @IsString()
  codeLanguage?: string;

  @IsOptional()
  @IsString()
  fileName?: string;

  @IsOptional()
  codeFiles?: any;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  tags?: string;

  @IsOptional()
  @IsString()
  folderId?: string | null;

  @IsOptional()
  @IsInt()
  order?: number;
}

export class UpdateDocumentDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  packages?: string;

  @IsOptional()
  @IsString()
  theory?: string;

  @IsOptional()
  @IsString()
  codePractice?: string;

  @IsOptional()
  @IsString()
  codeLanguage?: string;

  @IsOptional()
  @IsString()
  fileName?: string;

  @IsOptional()
  codeFiles?: any;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  tags?: string;

  @IsOptional()
  @IsString()
  folderId?: string | null;

  @IsOptional()
  @IsInt()
  order?: number;
}
