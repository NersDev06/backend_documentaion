import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding DocuVibe Database...');

  // Reset existing data
  await prisma.document.deleteMany();
  await prisma.folder.deleteMany();
  await prisma.setting.deleteMany();

  // Create Default Settings
  await prisma.setting.create({
    data: {
      id: 'default',
      activeTheme: 'crimson-charcoal',
      viewMode: 'graph',
    },
  });

  // 1. Root Folder: Frontend & React
  const frontendFolder = await prisma.folder.create({
    data: {
      name: 'Frontend & Architecture',
      icon: 'Layout',
      order: 1,
    },
  });

  // 2. Subfolder: Next.js Ecosystem
  const nextjsFolder = await prisma.folder.create({
    data: {
      name: 'Next.js & React',
      icon: 'Zap',
      parentId: frontendFolder.id,
      order: 1,
    },
  });

  // 3. Subfolder: UI & Glassmorphism
  const uiFolder = await prisma.folder.create({
    data: {
      name: 'Styling & Motion',
      icon: 'Palette',
      parentId: frontendFolder.id,
      order: 2,
    },
  });

  // 4. Root Folder: Backend & API
  const backendFolder = await prisma.folder.create({
    data: {
      name: 'Backend & Microservices',
      icon: 'Server',
      order: 2,
    },
  });

  // 5. Subfolder: Security & Auth
  const authFolder = await prisma.folder.create({
    data: {
      name: 'Security & Auth',
      icon: 'Shield',
      parentId: backendFolder.id,
      order: 1,
    },
  });

  // 6. Subfolder: Real-Time & WebSockets
  const realtimeFolder = await prisma.folder.create({
    data: {
      name: 'Real-Time & Events',
      icon: 'Radio',
      parentId: backendFolder.id,
      order: 2,
    },
  });

  // 7. Root Folder: Database & Cloud
  const dbFolder = await prisma.folder.create({
    data: {
      name: 'Databases & Neon',
      icon: 'Database',
      order: 3,
    },
  });

  // Docs creation
  // Doc 1: JWT Auth
  await prisma.document.create({
    data: {
      title: 'JWT Authentication & Refresh Token Flow',
      slug: 'jwt-auth-refresh-tokens',
      folderId: authFolder.id,
      packages: 'npm i @nestjs/jwt @nestjs/passport passport passport-jwt bcryptjs\nnpm i -D @types/passport-jwt @types/bcryptjs',
      theory: `### What is JWT Authentication?
JSON Web Tokens (JWT) are stateless security credentials. Instead of keeping sessions in Redis or memory, the client stores a cryptographically signed token and sends it in the \`Authorization: Bearer <token>\` header.

### Two-Token Flow (Access + Refresh):
1. **Access Token (15m)**: Short-lived token used to authenticate every API request.
2. **Refresh Token (7d-30d)**: Long-lived token stored safely in an \`httpOnly\` cookie. Used strictly to request a new access token without re-prompting credentials.
3. **Revocation**: Store the hash of valid refresh tokens in the database to allow remote session termination.`,
      codePractice: `import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateTokenPair(userId: string, email: string) {
    const payload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET || 'access-secret-key-12345',
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-key-67890',
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: 900,
    };
  }

  async verifyRefreshToken(token: string) {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-key-67890',
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}`,
      fileName: 'auth.service.ts',
      codeLanguage: 'typescript',
      notes: `> [!IMPORTANT]
> **Best Practices:**
> - Never store sensitive user data (passwords, social security, API keys) in the JWT payload.
> - Always set \`httpOnly: true\`, \`secure: true\`, and \`sameSite: 'strict'\` on refresh token cookies to thwart XSS and CSRF attacks.`,
      tags: 'auth,jwt,security,nestjs,tokens,backend',
      order: 1,
    },
  });

  // Doc 2: Next.js Server Actions & Caching
  await prisma.document.create({
    data: {
      title: 'Next.js Server Actions & Cache Revalidation',
      slug: 'nextjs-server-actions-revalidation',
      folderId: nextjsFolder.id,
      packages: 'npm i next@latest react@latest react-dom@latest server-only\nnpm i -D @types/react',
      theory: `### Why Server Actions?
Server Actions allow you to run asynchronous code directly on the server without creating boilerplate API routes (\`/api/...\`). They integrate seamlessly with React Forms, Optimistic UI updates, and Next.js built-in data cache.

### Core Cache APIs:
- \`revalidatePath(path)\`: Clears cached data for a specific URL route.
- \`revalidateTag(tag)\`: Clears only fetch requests marked with specific cache tags (\`next: { tags: ['posts'] }\`).`,
      codePractice: `'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod';

const CreatePostSchema = z.object({
  title: z.string().min(3, 'Title too short'),
  content: z.string().min(10, 'Content too short'),
});

export async function createPostAction(prevState: any, formData: FormData) {
  const parsed = CreatePostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
  });

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  // Perform database insert
  const response = await fetch('http://localhost:4000/api/documents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsed.data),
  });

  if (!response.ok) {
    return { success: false, error: 'Database write failed' };
  }

  // Invalidate cache
  revalidatePath('/docs');
  revalidateTag('documents');

  return { success: true, message: 'Document created successfully!' };
}`,
      fileName: 'actions/posts.ts',
      codeLanguage: 'typescript',
      notes: `> [!TIP]
> Combine Server Actions with \`useActionState\` or \`useOptimistic\` in client components for instant zero-latency feedback.`,
      tags: 'nextjs,react,server-actions,cache,frontend',
      order: 1,
    },
  });

  // Doc 3: Glassmorphism & iOS Liquid Blur
  await prisma.document.create({
    data: {
      title: 'iOS Liquid Glassmorphism & Micro-animations',
      slug: 'ios-glassmorphism-tailwind',
      folderId: uiFolder.id,
      packages: 'npm i clsx tailwind-merge framer-motion lucide-react',
      theory: `### The Secrets of Apple iOS Glassmorphism:
1. **Multi-layer Backdrop Filters**: Combine \`backdrop-blur(16px)\` with subtle \`backdrop-saturate(180%)\`.
2. **Specular Highlight Borders**: Use a top-to-bottom translucent gradient border (\`border-white/15\`) that mimics natural light refraction on glass edges.
3. **Ambient Drop Shadows**: Use colored or low-opacity dark shadows (\`shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]\`).
4. **Spring Physics**: Add tactile spring transitions when clicking or hovering buttons.`,
      codePractice: `import React from 'react';
import { motion } from 'framer-motion';

interface GlassButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'accent' | 'ghost';
}

export function GlassButton({ children, onClick, variant = 'primary' }: GlassButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={onClick}
      className={\`
        relative px-5 py-2.5 rounded-2xl font-medium text-sm
        bg-white/10 dark:bg-black/20 
        backdrop-blur-xl backdrop-saturate-150
        border border-white/20 dark:border-white/10
        shadow-[0_4px_24px_0_rgba(0,0,0,0.15)]
        hover:shadow-[0_8px_32px_0_rgba(239,68,68,0.25)]
        hover:border-red-500/40 transition-all duration-300
        overflow-hidden group
      \`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full duration-700 transition-transform" />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}`,
      fileName: 'GlassButton.tsx',
      codeLanguage: 'typescript',
      notes: `> [!NOTE]
> Always verify that the parent container has a non-opaque background, otherwise \`backdrop-filter\` won't have any pixels to blur.`,
      tags: 'glassmorphism,css,tailwind,framer-motion,ui,ios',
      order: 1,
    },
  });

  // Doc 4: Prisma + Neon Serverless Postgres
  await prisma.document.create({
    data: {
      title: 'Prisma ORM & Neon Serverless Connection Pooling',
      slug: 'prisma-neon-postgres-setup',
      folderId: dbFolder.id,
      packages: 'npm i @prisma/client @neondatabase/serverless\nnpm i -D prisma',
      theory: `### Why Neon for Serverless Applications?
Traditional Postgres servers choke when hundreds of serverless Lambdas open concurrent TCP connections. Neon provides an integrated **PgBouncer Connection Pooler** out of the box with zero setup.

### How to configure:
- Use the pooled connection string (\`-pooler\` in hostname) for queries in serverless environments.
- Use the direct connection string for Prisma migrations (\`prisma migrate dev\` / \`prisma db push\`).`,
      codePractice: `// backend/src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}`,
      fileName: 'prisma.service.ts',
      codeLanguage: 'typescript',
      notes: `> [!TIP]
> In your \`.env\`, append \`?sslmode=require&pgbouncer=true\` to your Neon connection string for optimal connection pooling.`,
      tags: 'prisma,database,neon,postgres,backend,orm',
      order: 1,
    },
  });

  // Doc 5: WebSockets Gateway in NestJS
  await prisma.document.create({
    data: {
      title: 'NestJS WebSockets Gateway with Socket.io',
      slug: 'nestjs-websockets-gateway',
      folderId: realtimeFolder.id,
      packages: 'npm i @nestjs/websockets @nestjs/platform-socket.io socket.io\nnpm i -D @types/socket.io',
      theory: `### WebSockets vs HTTP Polling:
HTTP requires clients to make repeated requests. WebSockets establish a **single persistent, bidirectional TCP connection**, enabling instant real-time broadcasts (e.g. notifications, collaborative editing, chat, live telemetry).

### NestJS Gateway Architecture:
- Decorators: \`@WebSocketGateway()\`, \`@SubscribeMessage('event')\`, \`@MessageBody()\`, \`@ConnectedSocket()\`.
- Built-in lifecycle hooks: \`OnGatewayConnection\`, \`OnGatewayDisconnect\`.`,
      codePractice: `import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'events',
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(\`⚡ Client connected: \${client.id}\`);
  }

  handleDisconnect(client: Socket) {
    console.log(\`❌ Client disconnected: \${client.id}\`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() room: string) {
    client.join(room);
    return { status: 'joined', room };
  }

  @SubscribeMessage('sendMessage')
  handleMessage(@ConnectedSocket() client: Socket, @MessageBody() payload: { room: string; message: string }) {
    this.server.to(payload.room).emit('newMessage', {
      senderId: client.id,
      text: payload.message,
      timestamp: new Date().toISOString(),
    });
  }
}`,
      fileName: 'events.gateway.ts',
      codeLanguage: 'typescript',
      notes: `> [!WARNING]
> For scaling WebSockets across multiple server instances, attach a **Redis Adapter** (\`@socket.io/redis-adapter\`) so events synchronize across all cluster nodes.`,
      tags: 'websockets,socketio,realtime,nestjs,events',
      order: 1,
    },
  });

  console.log('✅ DocuVibe Seed completed successfully with initial folders and docs!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
