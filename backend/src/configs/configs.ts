export default () => {
    const port = parseInt(process.env.PORT ?? "", 10) || 3000;
    return {
        port,
        app: {
            publicUrl: process.env.APP_PUBLIC_URL ?? `http://localhost:${port}`,
        },
        database: {
            host: process.env.DATABASE_HOST,
        },
        bcrypt: {
            saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS ?? "", 10) || 10
        },
        jwt: {
            secret: process.env.JWT_SECRET ?? "dev-secret-change-me",
            expiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
        },
        cors: {
            origin: process.env.API_URL,
            credentials: true,
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        },
        cookies: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
            maxAge: parseInt(process.env.JWT_COOKIE_MAX_AGE_MS ?? "", 10) || 7 * 24 * 60 * 60 * 1000,
        },
        uploads: {
            materialsDir: process.env.UPLOADS_MATERIALS_DIR ?? './uploads/materials',
            maxFileSizeBytes: parseInt(process.env.UPLOADS_MAX_FILE_SIZE_BYTES ?? "", 10) || 15 * 1024 * 1024,
            avatarsDir: process.env.UPLOADS_AVATARS_DIR ?? './uploads/avatars',
            maxAvatarSizeBytes: parseInt(process.env.UPLOADS_MAX_AVATAR_SIZE_BYTES ?? "", 10) || 2 * 1024 * 1024,
        },
        presence: {
            onlineThresholdMinutes: parseInt(process.env.ONLINE_THRESHOLD_MINUTES ?? "", 10) || 5,
            activeThresholdDays: parseInt(process.env.ACTIVE_THRESHOLD_DAYS ?? "", 10) || 7,
        },
    };
};
