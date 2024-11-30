export const AppErr = (message: string, statusCode: number) => {
    const err : any = new Error(message);
    err.statusCode = statusCode;
    throw err;
};

export const AppErrServer = (error : any) => {
    if (error instanceof Error) {
        return AppErr(error.message, 500);
    } else {
        return AppErr('Something went wrong', 500);
    }
}