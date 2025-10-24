import { applyDecorators, SetMetadata } from "@nestjs/common";
import { ConditionGuard, AuthType, ConditionGuardType } from "../constants/auth-constant";

export const AUTH_TYPE_KEY = 'auth';

export function Auth(authtype: AuthType | AuthType[], option: ConditionGuardType = ConditionGuard.AND) {
    return SetMetadata(AUTH_TYPE_KEY, { authtype, option });
}