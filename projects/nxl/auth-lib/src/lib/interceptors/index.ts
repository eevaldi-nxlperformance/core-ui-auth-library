import { TokenInterceptor } from './token.interceptor';
import { Error401Interceptor } from './error-401.interceptor';

export const interceptors: any[] = [TokenInterceptor, Error401Interceptor];

export * from './token.interceptor';
export * from './error-401.interceptor';
