exports.constants = Object.freeze({
    ENVIRONMENT: `${process.env.ENVIRONMENT || 'dev'}`,
    LOGGER_LEVEL: `${process.env.LOGGER_LEVEL || "INFO"}`,
    REGION: `${process.env.REGION || 'us-east-1'}`,
    APP_NAME: `${process.env.APP_NAME || 'appma'}`,
    JWT: {
        SECRET_VALUE: `${process.env.JTW_SECRET_VALUE || 'secret'}`,
        TOKEN_LIFE: `${process.env.JWT_TOKEN_LIFE || '1000'}`,
    },
});