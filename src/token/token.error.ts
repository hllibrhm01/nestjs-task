export class BaseTokenError extends Error {}
export class PrivateKeyNotPresentError extends BaseTokenError {}
export class KeyIdCannotBeFoundError extends BaseTokenError {}

export class TokenSaveError extends BaseTokenError {}
