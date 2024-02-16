export class AuthError extends Error {}

export class InvalidCredentialsError extends AuthError {}

export class UserWithEmailNotFoundError extends AuthError {}

export class InvalidResetPasswordTokenError extends AuthError {}
export class InvalidPasswordError extends AuthError {}

export class UserNotActivatedError extends AuthError {}
