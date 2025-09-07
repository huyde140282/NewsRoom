import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../dto/api-response.dto';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest();
    const isAlreadyFormatted = request.skipResponseFormat;

    return next.handle().pipe(
      map(data => {
        // Skip formatting if already formatted or if it's an error
        if (isAlreadyFormatted || data instanceof ApiResponse || data?.error) {
          return data;
        }

        // Return formatted response
        return new ApiResponse(data);
      }),
    );
  }
}
