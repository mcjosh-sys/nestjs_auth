import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_ROUTE_KEY = 'IS_PUBLIC_ROUTE';

export default function Public() {
  return SetMetadata(IS_PUBLIC_ROUTE_KEY, true);
}
