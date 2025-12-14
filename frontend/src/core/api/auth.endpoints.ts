// src/app/core/api/auth-endpoints.ts

import { API_BASE_URL } from './api.config';
import { ModuleEndpoints } from './interfaces/api.interface';

// Базовый префикс для всех маршрутов аутентификации
const AUTH_PREFIX = `${API_BASE_URL}/auth`;

export const AUTH_ENDPOINTS: ModuleEndpoints<AuthEndpointKeys> = {
    SIGN_IN: {
        url: `${AUTH_PREFIX}/signin`,
        methods: ['POST'],
        description: 'Аутентификация пользователя и получение JWT (через Cookie).',
    },

    // 2. Регистрация
    SIGN_UP: {
        url: `${AUTH_PREFIX}/signup`,
        methods: ['POST'],
        description: 'Создание нового пользователя и выдача JWT.',
    },

    // 3. Выход
    LOGOUT: {
        url: `${AUTH_PREFIX}/logout`,
        methods: ['POST'], // Используется POST для изменения состояния (удаление Cookie)
        description: 'Завершение сессии и удаление Cookie с токеном.',
    },

    // 4. Проверка статуса (GET)
    STATUS: {
        url: `${AUTH_PREFIX}/status`,
        methods: ['GET'],
        description: 'Проверка, аутентифицирован ли пользователь.',
    },
};

type AuthEndpointKeys = 'SIGN_IN'
    | 'SIGN_UP'
    | 'LOGOUT'
    | 'STATUS'; // Добавьте все ключи, которые будут в вашем объекте