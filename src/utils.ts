/*
 * Copyright (c) 2023 Marvin Witt
 * Licensed under the Open Software License version 3.0
 */

import { ZodError } from "zod";

export function isZodError(error: unknown): error is ZodError {
  return error instanceof ZodError;
}
