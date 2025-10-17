import { Prisma } from "@prisma/client";
import { error } from "console";

export function isUniqueConstraintError(error: any): error is Prisma.PrismaClientKnownRequestError {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
}