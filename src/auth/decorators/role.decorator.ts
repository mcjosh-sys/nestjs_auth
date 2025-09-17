import { Role } from "@lib/generated/prisma";
import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = "roles"

export const Roles = (...roles: [Role, ...Role[]]) => SetMetadata(ROLES_KEY, roles)