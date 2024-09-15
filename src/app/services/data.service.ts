import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { Data } from '../interfaces/data';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private API_URL = 'https://jsonplaceholder.typicode.com/posts';
  private LOCAL_STORAGE_KEY = 'localPosts';

  private localPostsSubject = new BehaviorSubject<Data[]>(
    this.loadPostsFromLocalStorage()
  );

  constructor(private http: HttpClient) {}

  getLocalPosts(): Observable<Data[]> {
    return this.localPostsSubject.asObservable();
  }

  getLocalPostsValue(): Data[] {
    return this.localPostsSubject.value;
  }

  private savePostsToLocalStorage(posts: Data[]): void {
    localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(posts));
  }

  private loadPostsFromLocalStorage(): Data[] {
    const savedPosts = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    return savedPosts ? JSON.parse(savedPosts) : [];
  }

  updateLocalPosts(posts: Data[]): void {
    this.localPostsSubject.next(posts);
    this.savePostsToLocalStorage(posts);
  }

  private mergePosts(apiPosts: Data[]): Data[] {
    const localPosts = this.getLocalPostsValue();
    const mergedPosts = [...localPosts];

    apiPosts.forEach((apiPost) => {
      if (!localPosts.some((localPost) => localPost.id === apiPost.id)) {
        mergedPosts.push(apiPost);
      }
    });

    return mergedPosts;
  }

  // Get the next unique ID based on the existing posts
  private getNextId(): number {
    const allPosts = this.getLocalPostsValue();
    const maxId =
      allPosts.length > 0 ? Math.max(...allPosts.map((post) => post.id)) : 0;
    return maxId + 1;
  }

  getAllPosts(page: number = 1, limit: number = 10): Observable<Data[]> {
    const params = new HttpParams()
      .set('_page', page.toString())
      .set('_limit', limit.toString());

    return this.http.get<Data[]>(this.API_URL, { params }).pipe(
      map((apiPosts) => {
        const mergedPosts = this.mergePosts(apiPosts);
        this.updateLocalPosts(mergedPosts);
        return mergedPosts;
      }),
      catchError((error) => {
        console.error('Error fetching posts', error);
        return throwError(() => new Error('Error fetching posts'));
      })
    );
  }

  createPost(post: Data): Observable<Data> {
    return this.http.post<Data>(this.API_URL, post).pipe(
      map((newPost) => {
        if (!newPost.id) {
          newPost.id = this.getNextId();
        }
        const updatedPosts = [...this.localPostsSubject.value, newPost];
        this.updateLocalPosts(updatedPosts);
        return newPost;
      }),
      catchError((error) => {
        console.error('Error creating post', error);
        return throwError(() => new Error('Error creating post'));
      })
    );
  }

  editPost(post: Data): Observable<Data> {
    if (post.id < 0) {
      console.log('Invalid post Id', post.id);
      return throwError(() => new Error('Invalid post Id'));
    }
    return this.http.put<Data>(`${this.API_URL}/${post.id}`, post).pipe(
      map((updatedPost) => {
        const updatedPosts = this.localPostsSubject.value.map((p) =>
          p.id === post.id ? updatedPost : p
        );
        this.updateLocalPosts(updatedPosts);
        return updatedPost;
      }),
      catchError((error) => {
        console.error('Error editing post', error);
        return throwError(() => new Error('Error editing post'));
      })
    );
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      map(() => {
        const updatedPosts = this.localPostsSubject.value.filter(
          (p) => p.id !== id
        );
        this.updateLocalPosts(updatedPosts);
      })
    );
  }

  getPostByUserId(postId: number): Observable<Data[]> {
    return this.localPostsSubject.pipe(
      map((posts: Data[]) => posts.filter((post) => post.id === postId))
    );
  }
}
