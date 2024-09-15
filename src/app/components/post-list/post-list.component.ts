import { Component, OnInit } from '@angular/core';
import { Data } from '../../interfaces/data';
import { CommentService } from '../../services/comment.service';
import { DataService } from '../../services/data.service';
import { Observable, forkJoin, switchMap, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PostCreateComponent } from "../post-create/post-create.component";

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, RouterModule, PostCreateComponent],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit {
  posts$!: Observable<Data[]>;
  postsWithComments$!: Observable<{ post: Data; commentsCount: number }[]>;

  constructor(
    private dataService: DataService,
    private commentService: CommentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Fetch posts
    this.posts$ = this.dataService.getAllPosts();

    // Fetch posts along with corresponding comments count
    this.postsWithComments$ = this.posts$.pipe(
      switchMap((posts: Data[]) => {
        const postWithCommentObservables = posts.map((post: Data) =>
          this.commentService.getCommentByPostId(post.id).pipe(
            map((comments) => ({
              post,
              commentsCount: comments.length,
            }))
          )
        );
        return forkJoin(postWithCommentObservables);
      })
    );
  }
}
