export const REQUEST_USER_KEY = 'user';

export const AuthType = {
   BEARER: 'Bearer',
   NONE: 'None',
   API_KEY: 'ApiKey',
} as const;

export type AuthType = (typeof AuthType)[keyof typeof AuthType];

export const ConditionGuard = {
   AND: 'AND',
} as const;

export type ConditionGuardType = (typeof ConditionGuard)[keyof typeof ConditionGuard];