import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDocumentDto, UpdateDocumentDto } from './dto/document.dto';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  private transformDoc(doc: any) {
    if (!doc) return null;
    let parsedCodeFiles = undefined;
    if (doc.codeFiles) {
      try {
        parsedCodeFiles = typeof doc.codeFiles === 'string' ? JSON.parse(doc.codeFiles) : doc.codeFiles;
      } catch {
        parsedCodeFiles = undefined;
      }
    }
    return {
      ...doc,
      codeFiles: parsedCodeFiles,
    };
  }

  async findAll(query?: { folderId?: string; tag?: string; search?: string }) {
    const where: any = {};

    if (query?.folderId) {
      where.folderId = query.folderId;
    }

    if (query?.tag) {
      where.tags = {
        contains: query.tag,
      };
    }

    if (query?.search) {
      const s = query.search.trim();
      where.OR = [
        { title: { contains: s } },
        { theory: { contains: s } },
        { packages: { contains: s } },
        { codePractice: { contains: s } },
        { tags: { contains: s } },
      ];
    }

    const docs = await this.prisma.document.findMany({
      where,
      orderBy: { order: 'asc' },
      include: {
        folder: {
          select: {
            id: true,
            name: true,
            icon: true,
          },
        },
      },
    });

    return docs.map((doc) => this.transformDoc(doc));
  }

  async getAllTags() {
    const docs = await this.prisma.document.findMany({
      select: { tags: true },
    });

    const tagCounts: { [tag: string]: number } = {};
    docs.forEach((doc) => {
      if (doc.tags) {
        const parts = doc.tags.split(',').map((t) => t.trim()).filter(Boolean);
        parts.forEach((tag) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });

    return Object.entries(tagCounts)
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }

  async findOne(id: string) {
    const document = await this.prisma.document.findUnique({
      where: { id },
      include: {
        folder: true,
      },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    return this.transformDoc(document);
  }

  async create(dto: CreateDocumentDto) {
    const codeFilesString =
      dto.codeFiles !== undefined
        ? typeof dto.codeFiles === 'string'
          ? dto.codeFiles
          : JSON.stringify(dto.codeFiles)
        : null;

    const doc = await this.prisma.document.create({
      data: {
        title: dto.title,
        slug: dto.slug || dto.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        packages: dto.packages || '',
        theory: dto.theory,
        codePractice: dto.codePractice,
        codeLanguage: dto.codeLanguage || 'typescript',
        fileName: dto.fileName || 'index.ts',
        codeFiles: codeFilesString,
        notes: dto.notes || '',
        tags: dto.tags || '',
        folderId: dto.folderId || null,
        order: dto.order ?? 0,
      },
      include: {
        folder: true,
      },
    });

    return this.transformDoc(doc);
  }

  async update(id: string, dto: UpdateDocumentDto) {
    await this.findOne(id);

    const codeFilesString =
      dto.codeFiles !== undefined
        ? typeof dto.codeFiles === 'string'
          ? dto.codeFiles
          : JSON.stringify(dto.codeFiles)
        : undefined;

    const doc = await this.prisma.document.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.slug !== undefined && { slug: dto.slug }),
        ...(dto.packages !== undefined && { packages: dto.packages }),
        ...(dto.theory !== undefined && { theory: dto.theory }),
        ...(dto.codePractice !== undefined && { codePractice: dto.codePractice }),
        ...(dto.codeLanguage !== undefined && { codeLanguage: dto.codeLanguage }),
        ...(dto.fileName !== undefined && { fileName: dto.fileName }),
        ...(codeFilesString !== undefined && { codeFiles: codeFilesString }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
        ...(dto.tags !== undefined && { tags: dto.tags }),
        ...(dto.folderId !== undefined && { folderId: dto.folderId || null }),
        ...(dto.order !== undefined && { order: dto.order }),
      },
      include: {
        folder: true,
      },
    });

    return this.transformDoc(doc);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.document.delete({
      where: { id },
    });
  }
}
