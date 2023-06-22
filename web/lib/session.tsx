export const sessionOptions = {
    password: process.env.SECRET_COOKIE_PASSWORD,
    cookieName: 'patchwork-kingdoms/login',
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
    },
};

// This is where we specify the typings of req.session.*
declare module 'iron-session' {
    interface IronSessionData {
        user?: User;
    }
}
