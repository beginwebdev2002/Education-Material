import { API_BASE_URL } from './api.config';
import { ModuleEndpoints } from './api.interface';

// Base prefixes
const AUTH_PREFIX = `${API_BASE_URL}/auth`;
const USER_PREFIX = `${API_BASE_URL}/users`;
const MATERIALS_PREFIX = `${API_BASE_URL}/materials`;
const COMMENTS_PREFIX = `${API_BASE_URL}/comments`;
const ADMIN_PREFIX = `${API_BASE_URL}/admin`;

type AuthEndpointKeys = 'SIGN_IN' | 'SIGN_UP' | 'LOGOUT';
type UserEndpointKeys = 'GET_PROFILE' | 'UPDATE_PROFILE' | 'GET_ALL_USERS' | 'UPDATE_ROLE' | 'UPDATE_BAN' | 'GET_BY_ID';
type MaterialsEndpointKeys = 'LIST' | 'MINE' | 'ADMIN_LIST' | 'UPLOAD' | 'DOWNLOAD' | 'DELETE' | 'UPDATE_STATUS';
type CommentsEndpointKeys = 'LIST_FOR_MATERIAL' | 'CREATE' | 'DELETE' | 'ADMIN_LIST';
type AdminEndpointKeys = 'OVERVIEW' | 'ONLINE_USERS' | 'ANALYTICS' | 'ACTIVITY';

export const AUTH_ENDPOINTS: ModuleEndpoints<AuthEndpointKeys> = {
    SIGN_IN: {
        url: `${AUTH_PREFIX}/signin`,
        methods: ['POST'],
        description: 'Аутентификация пользователя, выдаёт accessToken и refreshToken-cookie.',
    },
    SIGN_UP: {
        url: `${AUTH_PREFIX}/signup`,
        methods: ['POST'],
        description: 'Создание нового пользователя и выдача токенов.',
    },
    LOGOUT: {
        url: `${AUTH_PREFIX}/logout`,
        methods: ['POST'],
        description: 'Завершение сессии: удаление сессионной cookie.',
    },
};

export const USER_ENDPOINTS: ModuleEndpoints<UserEndpointKeys> = {
    GET_PROFILE: {
        url: `${USER_PREFIX}/me`,
        methods: ['GET'],
        description: 'Получение профиля текущего пользователя',
    },
    UPDATE_PROFILE: {
        url: `${USER_PREFIX}/me`,
        methods: ['PATCH'],
        description: 'Обновление профиля текущего пользователя',
    },
    GET_ALL_USERS: {
        url: `${USER_PREFIX}`,
        methods: ['GET'],
        description: 'Получение списка всех пользователей (только для админа)',
    },
    UPDATE_ROLE: {
        url: `${USER_PREFIX}`,
        methods: ['PATCH'],
        description: 'Изменение роли пользователя (только для админа)',
    },
    UPDATE_BAN: {
        url: `${USER_PREFIX}`,
        methods: ['PATCH'],
        description: 'Блокировка/разблокировка пользователя (только для админа)',
    },
    GET_BY_ID: {
        url: `${USER_PREFIX}`,
        methods: ['GET'],
        description: 'Публичный профиль пользователя по id',
    },
};

export const MATERIALS_ENDPOINTS: ModuleEndpoints<MaterialsEndpointKeys> = {
    LIST: {
        url: `${MATERIALS_PREFIX}`,
        methods: ['GET'],
        description: 'Список опубликованных материалов',
    },
    MINE: {
        url: `${MATERIALS_PREFIX}/mine`,
        methods: ['GET'],
        description: 'Материалы текущего пользователя',
    },
    ADMIN_LIST: {
        url: `${MATERIALS_PREFIX}/admin`,
        methods: ['GET'],
        description: 'Все материалы для модерации (только для админа)',
    },
    UPLOAD: {
        url: `${MATERIALS_PREFIX}`,
        methods: ['POST'],
        description: 'Загрузка нового материала (DOCX/PDF)',
    },
    DOWNLOAD: {
        url: `${MATERIALS_PREFIX}`,
        methods: ['GET'],
        description: 'Скачивание материала',
    },
    DELETE: {
        url: `${MATERIALS_PREFIX}`,
        methods: ['DELETE'],
        description: 'Удаление материала',
    },
    UPDATE_STATUS: {
        url: `${MATERIALS_PREFIX}`,
        methods: ['PATCH'],
        description: 'Изменение статуса модерации материала',
    },
};

export const COMMENTS_ENDPOINTS: ModuleEndpoints<CommentsEndpointKeys> = {
    LIST_FOR_MATERIAL: {
        url: `${API_BASE_URL}/materials`,
        methods: ['GET'],
        description: 'Комментарии к материалу',
    },
    CREATE: {
        url: `${API_BASE_URL}/materials`,
        methods: ['POST'],
        description: 'Добавить комментарий к материалу',
    },
    DELETE: {
        url: `${COMMENTS_PREFIX}`,
        methods: ['DELETE'],
        description: 'Удалить комментарий',
    },
    ADMIN_LIST: {
        url: `${COMMENTS_PREFIX}/admin/all`,
        methods: ['GET'],
        description: 'Все комментарии для модерации (только для админа)',
    },
};

export const ADMIN_ENDPOINTS: ModuleEndpoints<AdminEndpointKeys> = {
    OVERVIEW: {
        url: `${ADMIN_PREFIX}/overview`,
        methods: ['GET'],
        description: 'Сводная статистика для дашборда админки',
    },
    ONLINE_USERS: {
        url: `${ADMIN_PREFIX}/online-users`,
        methods: ['GET'],
        description: 'Пользователи, активные прямо сейчас',
    },
    ANALYTICS: {
        url: `${ADMIN_PREFIX}/analytics`,
        methods: ['GET'],
        description: 'Динамика регистраций/скачиваний и топ материалов',
    },
    ACTIVITY: {
        url: `${ADMIN_PREFIX}/activity`,
        methods: ['GET'],
        description: 'Журнал действий пользователей',
    },
};
