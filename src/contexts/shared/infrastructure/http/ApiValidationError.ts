import { ValidationError } from "@/contexts/shared/domain/ValidationError";

export class ApiValidationError extends ValidationError {
  readonly type = "API_VALIDATION_ERROR";
  
  constructor(message: string) {
    super("API_VALIDATION_ERROR", message);
  }
}
