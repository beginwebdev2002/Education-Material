import { API_BASE_URL } from './api.config';
import { ModuleEndpoints } from './api.interface';

// Base prefixes
const AUTH_PREFIX = `${API_BASE_URL}/auth`;
const USER_PREFIX = `${API_BASE_URL}/users`;

type AuthEndpointKeys = 'SIGN_IN' | 'SIGN_UP' | 'LOGOUT' | 'STATUS';
type UserEndpointKeys = 'GET_PROFILE' | 'UPDATE_PROFILE' | 'DELETE_PROFILE' | 'GET_ALL_USERS';

export const AUTH_ENDPOINTS: ModuleEndpoints<AuthEndpointKeys> = {
    SIGN_IN: {
        url: `${AUTH_PREFIX}/signin`,
        methods: ['POST'],
        description: 'Аутентификация пользователя и получение JWT (через Cookie).',
    },
    SIGN_UP: {
        url: `${AUTH_PREFIX}/signup`,
        methods: ['POST'],
        description: 'Создание нового пользователя и выдача JWT.',
    },
    LOGOUT: {
        url: `${AUTH_PREFIX}/logout`,
        methods: ['POST'],
        description: 'Завершение сессии и удаление Cookie с токеном.',
    },
    STATUS: {
        url: `${AUTH_PREFIX}/status`,
        methods: ['GET'],
        description: 'Проверка, аутентифицирован ли пользователь.',
    },
};

export const USER_ENDPOINTS: ModuleEndpoints<UserEndpointKeys> = {
    GET_PROFILE: {
        url: `${USER_PREFIX}/me`,
        methods: ['GET'],
        description: 'Получение профиля текущего пользователя'
    },
    UPDATE_PROFILE: {
        url: `${USER_PREFIX}/me`,
        methods: ['PUT', 'PATCH'],
        description: 'Обновление профиля текущего пользователя'
    },
    DELETE_PROFILE: {
        url: `${USER_PREFIX}/me`,
        methods: ['DELETE'],
        description: 'Удаление текущего пользователя'
    },
    GET_ALL_USERS: {
        url: `${USER_PREFIX}/`,
        methods: ['GET'],
        description: 'Получение списка всех пользователей'
    },
};
