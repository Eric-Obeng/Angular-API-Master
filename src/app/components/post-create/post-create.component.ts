import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { Data } from '../../interfaces/data';
import { FormsComponent } from '../forms/forms.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [FormsComponent, CommonModule],
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss'],
})
export class PostCreateComponent {
  showFormModal = false;

  constructor(private postService: DataService, private router: Router) {}

  openPostForm(): void {
    this.showFormModal = true;
  }

  handleFormSubmit(post: Data): void {
    this.postService.createPost(post).subscribe({
      next: (newPost) => {
        console.log('Post created successfully:', newPost);
        // No need to call updateLocalPosts here; DataService handles it.
        this.router.navigate(['/posts']);
        this.showFormModal = false;
      },
      error: (err) => {
        console.error('Error creating post', err);
      },
    });
  }
}
