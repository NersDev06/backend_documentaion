import { Injectable } from '@nestjs/common';

export interface GeneratedDocResult {
  title: string;
  folderName: string;
  packages: string;
  theory: string;
  codePractice: string;
  fileName: string;
  codeLanguage: string;
  notes: string;
  tags: string;
}

@Injectable()
export class AiService {
  async generateDocumentation(prompt: string, folderId?: string): Promise<GeneratedDocResult> {
    const lower = prompt.toLowerCase();

    if (lower.includes('jwt') || lower.includes('auth') || lower.includes('token')) {
      return {
        title: 'JWT Authentication & Refresh Token Flow',
        folderName: 'Backend & Security',
        packages: 'npm i @nestjs/jwt @nestjs/passport passport passport-jwt bcryptjs\nnpm i -D @types/passport-jwt @types/bcryptjs',
        theory: `### Что такое JWT?
JSON Web Token (JWT) — компактный формат передачи зашифрованных данных пользователя между клиентом и сервером.

### Преимущества:
- **Stateless**: Серверу не нужно хранить состояние сессии в оперативной памяти.
- **Подпись**: Токен защищен секретным ключом и не может быть модифицирован клиентом.

### Двухтокенная схема:
1. **Access Token (15 мин)**: Передается в \`Authorization: Bearer <token>\`.
2. **Refresh Token (7-30 дней)**: Хранится в \`httpOnly\` Cookie.`,
        codePractice: `import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };
    
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET || 'access-secret',
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }
}`,
        fileName: 'auth.service.ts',
        codeLanguage: 'typescript',
        notes: `> [!WARNING]
> Для refresh токенов обязательно использовать флаги httpOnly: true и sameSite: 'strict'.`,
        tags: 'auth,jwt,security,nestjs,tokens',
      };
    }

    return {
      title: `${prompt.charAt(0).toUpperCase() + prompt.slice(1)} Architecture & Cheatsheet`,
      folderName: 'General Architecture',
      packages: `npm i ${prompt.toLowerCase().replace(/[^a-z0-9]+/g, '-')}\nnpm i -D @types/node`,
      theory: `### Обзор: ${prompt}
Практичный справочник и архитектурный паттерн для разработки масштабируемых веб-приложений.

### Ключевые моменты:
- Минимизация бойлерплейта и четкое разделение ответственности.
- Строгая типизация и обработка ошибок.`,
      codePractice: `// Пример реализации для ${prompt}
export class ExampleService {
  async execute() {
    console.log('Выполнение логики для ${prompt}');
    return { success: true };
  }
}`,
      fileName: `${prompt.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.service.ts`,
      codeLanguage: 'typescript',
      notes: `> [!TIP]
> Храните конфигурацию в переменных окружения .env.`,
      tags: `${prompt.toLowerCase().replace(/[^a-z0-9]+/g, ',')},docs,dev`,
    };
  }
}
