import { Container } from '@cloudflare/containers';

export interface ContainerEnvironment {
  SECRET_KEY: string;
  EMAIL_HOST_USER: string;
  EMAIL_HOST_PASSWORD: string;
  DEBUG: string;
  ALLOWED_HOSTS: string;
  CSRF_TRUSTED_ORIGINS: string;
  CONTACT_EMAIL: string;
  DEFAULT_FROM_EMAIL: string;
  EMAIL_BACKEND: string;
  EMAIL_HOST: string;
  EMAIL_PORT: string;
  EMAIL_USE_TLS: string;
  EMAIL_USE_SSL: string;
}

export interface Env extends ContainerEnvironment {
  DJANGO_CONTAINER: DurableObjectNamespace<DjangoContainer>;
}

export class DjangoContainer extends Container<ContainerEnvironment> {
  defaultPort = 8000;
  sleepAfter = '10m';

  constructor(ctx: DurableObjectState<{}>, env: ContainerEnvironment) {
    super(ctx, env);
    this.env = {
      SECRET_KEY: env.SECRET_KEY,
      EMAIL_HOST_USER: env.EMAIL_HOST_USER,
      EMAIL_HOST_PASSWORD: env.EMAIL_HOST_PASSWORD,
      DEBUG: env.DEBUG,
      ALLOWED_HOSTS: env.ALLOWED_HOSTS,
      CSRF_TRUSTED_ORIGINS: env.CSRF_TRUSTED_ORIGINS,
      CONTACT_EMAIL: env.CONTACT_EMAIL,
      DEFAULT_FROM_EMAIL: env.DEFAULT_FROM_EMAIL,
      EMAIL_BACKEND: env.EMAIL_BACKEND,
      EMAIL_HOST: env.EMAIL_HOST,
      EMAIL_PORT: env.EMAIL_PORT,
      EMAIL_USE_TLS: env.EMAIL_USE_TLS,
      EMAIL_USE_SSL: env.EMAIL_USE_SSL,
    };
  }
}

export default {
  fetch(request: Request, env: Env): Promise<Response> {
    const headers = new Headers(request.headers);
    headers.set('X-Forwarded-Proto', new URL(request.url).protocol.slice(0, -1));
    const forwardedRequest = new Request(request, { headers });
    const container = env.DJANGO_CONTAINER.getByName('dewday-production');
    return container.fetch(forwardedRequest);
  },
};