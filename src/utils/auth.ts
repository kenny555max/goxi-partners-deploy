import { cookies } from "next/headers";
import { redirect } from 'next/navigation';
import { jwtVerify, SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "goxi-secret-key-change-in-production"
);

export type UserData = {
    userId: string;
    unitId: string;
    email: string;
    name: string;
    address: string;
    phone: string;
    role: string;
    iat?: number;
    exp?: number;
};

export const getAuthToken = () => {
    const cookieStore = cookies();
    const token = cookieStore.get('goxi-auth-token')?.value;
    return token;
};

export const verifyAuth = async (): Promise<{ authenticated: boolean; userData?: UserData }> => {
    try {
        const token = getAuthToken();

        if (!token) {
            return { authenticated: false };
        }

        const { payload } = await jwtVerify(token, JWT_SECRET);
        return { authenticated: true, userData: payload as unknown as UserData };
    } catch (error) {
        return { authenticated: false };
    }
};

export const createToken = async (userData: Omit<UserData, 'iat' | 'exp'>) => {
    const token = await new SignJWT({ ...userData })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(JWT_SECRET);

    return token;
};

export const setAuthCookie = (token: string) => {
    cookies().set({
        name: 'goxi-auth-token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
    });
};

export const requireAuth = async () => {
    const { authenticated, userData } = await verifyAuth();

    if (!authenticated) {
        return null;
    }

    return userData;
};

export const redirectToLogin = () => {
    redirect('/login');
};

export const clearAuth = () => {
    cookies().delete('goxi-auth-token');
};