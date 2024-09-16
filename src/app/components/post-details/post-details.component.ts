import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DataService } from '../../services/data.service';
import { CommentService } from '../../services/comment.service';
import { Observable, of, switchMap } from 'rxjs';
import { Comment, Data } from '../../interfaces/data';
import { CommonModule } from '@angular/common';
import { FormsComponent } from '../forms/forms.component';

@Component({
  selector: 'app-post-details',
  standalone: true,
  imports: [CommonModule, FormsComponent, RouterModule],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.scss',
})
export class PostDetailsComponent {
  post$!: Observable<Data | null>;
  comments$!: Observable<Comment[]>;
  currentPost!: Data;

  showFormModal: boolean = false;
  deleteModal = false;

  constructor(
    private postService: DataService,
    private commentService: CommentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id');

    this.post$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const postId = Number(params.get('id'));
        console.log('Routed post ID:', postId); // Debugging: Log the routed post ID
        return this.postService.getPostByUserId(postId).pipe(
          switchMap((posts) => {
            console.log('Fetched post data:', posts); // Debugging: Log the fetched posts
            return posts.length ? of(posts[0]) : of(null);
          })
        );
      })
    );

    // Fetch comments for the post
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const postId = Number(params.get('id'));
          return this.commentService.getCommentByPostId(postId);
        })
      )
      .subscribe({
        next: (comments) => (this.comments$ = of(comments)),
      });

    this.post$.subscribe((post) => {
      if (post) {
        this.currentPost = post;
      }
    });
  }

  openPostForm() {
    this.showFormModal = true;
  }

  openDeleteModal() {
    this.deleteModal = true;
  }

  closeDeleteModal() {
    this.deleteModal = false;
  }

  onDeleteModal(id: number) {
    console.log('deleting post with id', id);
    this.postService.deletePost(id).subscribe({
      next: () => {
        this.closeDeleteModal();
        this.router.navigate(['/posts']);
      },
      error: (err) => {
        console.error('Error deleting post', err);
      },
    });
  }

  handleFormEdit(post: Data) {
    this.postService.editPost(post).subscribe({
      next: () => {
        this.showFormModal = false;
        this.router.navigate(['/posts']);
      },
    });
  }
}
