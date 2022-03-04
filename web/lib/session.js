export const sessionOptions = {
    password: process.env.SECRET_COOKIE_PASSWORD,
    cookieName: 'patchwork-kingdoms/login',
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
    },
}
