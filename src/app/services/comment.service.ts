import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from '../interfaces/data';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private COMMENTS_API_URL = 'https://jsonplaceholder.typicode.com/comments';

  constructor(private http: HttpClient) {}

  getCommentByPostId(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(
      `${this.COMMENTS_API_URL}?postId=${postId}`
    );
  }
}
