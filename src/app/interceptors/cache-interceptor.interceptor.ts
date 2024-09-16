import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { CacheService } from '../services/cache.service';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  constructor(private cacheService: CacheService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.method !== 'GET') {
      return next.handle(req);
    }

    const cachedResponse = this.cacheService.get(req.urlWithParams);
    if (cachedResponse) {
      console.log("Cache Interceptor", req.urlWithParams);
      return new Observable<HttpEvent<any>>((observer) => {
        observer.next(new HttpResponse({ body: cachedResponse }));
        observer.complete();
      });
    }

    return next.handle(req).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          this.cacheService.set(req.urlWithParams, event.body);
        }
      })
    );
  }
}
