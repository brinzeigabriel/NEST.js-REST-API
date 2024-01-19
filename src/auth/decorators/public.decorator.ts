import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
// am creat decoratorul acesta pentru a seta ce endpoint poate fi public " @Public() " si metadata isPublic+true cand validam in auth.guard.ts
