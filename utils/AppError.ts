
export class ValidationError extends Error {
  code: string;
  name = "ValidationError";

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}
