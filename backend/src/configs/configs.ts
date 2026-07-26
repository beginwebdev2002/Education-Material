export default () => ({
    port: parseInt(process.env.PORT ?? "", 10) || 3000,
    database: {
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT ?? "", 10) || 5432
    },
    bcrypt: {
        saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS ?? "", 10) || 10
    },
    jwt: {
        access: {
            secret: process.env.JWT_ACCESS_SECRET ?? "access-secret-key",
            expiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",
        },
        refresh: {
            secret: process.env.JWT_REFRESH_SECRET ?? "refresh-secret-key",
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",
            expiresInMs: parseInt(process.env.JWT_REFRESH_EXPIRES_IN_MS ?? "", 10) || 7 * 24 * 60 * 60 * 1000,
        },
    },
    cors: {
        origin: process.env.API_URL,
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    },
    refreshCookie: {
        name: 'refresh_token',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/auth',
    },
    uploads: {
        materialsDir: process.env.UPLOADS_MATERIALS_DIR ?? './uploads/materials',
        maxFileSizeBytes: parseInt(process.env.UPLOADS_MAX_FILE_SIZE_BYTES ?? "", 10) || 15 * 1024 * 1024,
    },
    presence: {
        onlineThresholdMinutes: parseInt(process.env.ONLINE_THRESHOLD_MINUTES ?? "", 10) || 5,
        activeThresholdDays: parseInt(process.env.ACTIVE_THRESHOLD_DAYS ?? "", 10) || 7,
    },
});
