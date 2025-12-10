export default () => ({
    port: parseInt(process.env.PORT ?? "", 10) || 3000,
    database: {
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT ?? "", 10) || 5432
    },
    bcrypt: {
        saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS ?? "", 7) || 7
    },
    jwt: {
        secret: process.env.JWT_SECRET ?? "secretKey",
        expiresIn: process.env.JWT_EXPIRES_IN ?? "30d"
    }
});