// src/app/core/api/api-config.ts

import { environment } from "@environments/environment";

export const API_BASE_URL = environment.apiUrl || 'http://localhost:3000';