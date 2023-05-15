import { HttpException } from '@nestjs/common';

export const httpExceptionHandler = (message: string, httpStatus: number) => {
  throw new HttpException(
    {
      error: true,
      message: [message],
      data: null,
    },
    httpStatus,
  );
};
