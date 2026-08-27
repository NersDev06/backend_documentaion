"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoldersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FoldersService = class FoldersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
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
        const folderMap = new Map();
        allFolders.forEach((folder) => {
            folderMap.set(folder.id, { ...folder, children: [] });
        });
        const rootFolders = [];
        allFolders.forEach((folder) => {
            if (folder.parentId && folderMap.has(folder.parentId)) {
                folderMap.get(folder.parentId).children.push(folderMap.get(folder.id));
            }
            else {
                rootFolders.push(folderMap.get(folder.id));
            }
        });
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
    async findOne(id) {
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
            throw new common_1.NotFoundException(`Folder with ID ${id} not found`);
        }
        return folder;
    }
    async create(dto) {
        return this.prisma.folder.create({
            data: {
                name: dto.name,
                icon: dto.icon || 'Folder',
                parentId: dto.parentId || null,
                order: dto.order ?? 0,
            },
        });
    }
    async update(id, dto) {
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
    async remove(id) {
        await this.findOne(id);
        return this.prisma.folder.delete({
            where: { id },
        });
    }
};
exports.FoldersService = FoldersService;
exports.FoldersService = FoldersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FoldersService);
//# sourceMappingURL=folders.service.js.map