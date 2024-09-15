import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpResponse,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export const httpInterceptorFn: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const token = 'mock-auth-token';

  // Clone request and add mock token
  const clonedReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Log request and response
  return next(clonedReq).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          console.log('HTTP Response:', event);
        }
      },
      error: (error) => {
        console.error('HTTP Error:', error);
      },
    })
  );
};
