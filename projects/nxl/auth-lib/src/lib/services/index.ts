import { MsalService } from './b2c.service';
import { TokenService } from './token.service';

export const services: any[] = [MsalService, TokenService];

export * from './b2c.service';
export * from './token.service';
