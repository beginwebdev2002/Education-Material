import { API_BASE_URL } from './api.config';
import { ModuleEndpoints } from './interfaces/api.interface';

const USER_PREFIX = `${API_BASE_URL}/users`;

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
}

type UserEndpointKeys = 'GET_PROFILE' | 'UPDATE_PROFILE' | 'DELETE_PROFILE' | 'GET_ALL_USERS';