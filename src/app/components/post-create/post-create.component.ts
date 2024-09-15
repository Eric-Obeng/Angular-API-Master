import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Router, RouterModule } from '@angular/router';
import { Data } from '../../interfaces/data';
import { FormsComponent } from '../forms/forms.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [FormsComponent, RouterModule, CommonModule],
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.scss',
})
export class PostCreateComponent {
  showFormModal: boolean = false;

  constructor(private postService: DataService, private router: Router) {}

  openPostForm() {
    this.showFormModal = true;
  }

  handleFormSubmit(post: Data) {
    this.postService.createPost(post).subscribe({
      next: (newPost) => {
        const currentPosts = this.postService.getLocalPostsValue();
        this.postService['localPostsSubject'].next([newPost, ...currentPosts]);
        this.router.navigate(['/posts']);
        this.showFormModal = false;
      },
      error: (err) => {
        console.error('Error creating post', err);
      },
    });
  }
}
