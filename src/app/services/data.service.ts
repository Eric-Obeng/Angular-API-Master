import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Data } from '../interfaces/data';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private API_URL = 'https://jsonplaceholder.typicode.com/posts';

  constructor(private http: HttpClient) {}

  // getAllPosts(): Observable<Data[]> {
  //   return this.http.get<Data[]>(this.API_URL);
  // }

  //  method to get all post
  getAllPosts(page: number = 1, limit: number = 10): Observable<Data[]> {
    const params = new HttpParams()
      .set('_page', page.toString())
      .set('_limit', limit.toString());
    return this.http.get<Data[]>(this.API_URL, { params }).pipe(
      catchError((error) => {
        console.error('Error fetching posts', error);
        return throwError(() => new Error('Error fetching posts'));
      })
    );
  }

  // method to create post
  createPost(post: Data): Observable<Data> {
    return this.http.post<Data>(this.API_URL, post);
  }

  // method to edit post
  editPost(post: Data): Observable<Data> {
    return this.http.put<Data>(`${this.API_URL}/${post.id}`, post);
  }

  // method to delete post
  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  getPostByUserId(userId: number): Observable<Data[]> {
    return this.http.get<Data[]>(`${this.API_URL}?userId=${userId}`);
  }
}
