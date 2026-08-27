import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFolderDto, UpdateFolderDto } from './dto/folder.dto';

@Injectable()
export class FoldersService {
  constructor(private prisma: PrismaService) {}

  async getTree() {
    const allFolders = await this.prisma.folder.findMany({
      orderBy: { order: 'asc' },
      include: {
        documents: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            slug: true,
            tags: true,
            folderId: true,
            order: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    // Build hierarchical tree structure
    const folderMap = new Map();
    allFolders.forEach((folder) => {
      folderMap.set(folder.id, { ...folder, children: [] });
    });

    const rootFolders: any[] = [];
    allFolders.forEach((folder) => {
      if (folder.parentId && folderMap.has(folder.parentId)) {
        folderMap.get(folder.parentId).children.push(folderMap.get(folder.id));
      } else {
        rootFolders.push(folderMap.get(folder.id));
      }
    });

    // Also get root documents (without folder)
    const rootDocs = await this.prisma.document.findMany({
      where: { folderId: null },
      orderBy: { order: 'asc' },
    });

    return {
      tree: rootFolders,
      allFolders: allFolders,
      rootDocuments: rootDocs,
    };
  }

  async findAll() {
    return this.prisma.folder.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { documents: true, children: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const folder = await this.prisma.folder.findUnique({
      where: { id },
      include: {
        children: {
          include: {
            documents: true,
          },
        },
        documents: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!folder) {
      throw new NotFoundException(`Folder with ID ${id} not found`);
    }

    return folder;
  }

  async create(dto: CreateFolderDto) {
    return this.prisma.folder.create({
      data: {
        name: dto.name,
        icon: dto.icon || 'Folder',
        parentId: dto.parentId || null,
        order: dto.order ?? 0,
      },
    });
  }

  async update(id: string, dto: UpdateFolderDto) {
    await this.findOne(id);
    return this.prisma.folder.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.icon !== undefined && { icon: dto.icon }),
        ...(dto.parentId !== undefined && { parentId: dto.parentId || null }),
        ...(dto.order !== undefined && { order: dto.order }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.folder.delete({
      where: { id },
    });
  }
}
