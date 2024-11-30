import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export async function CreateUserToken(payload: any) {
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn : '30d' });
    return token;
}