import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { Data } from '../../interfaces/data';
import { FormsComponent } from "../forms/forms.component";

@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [FormsComponent],
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.scss',
})
export class PostCreateComponent {
  showFormModal: boolean = false;

  constructor(private postService: DataService, private router: Router) {}

  openPostForm() {
    this.showFormModal = true;
  }

  handleForSubmit(post: Data) {
    this.postService.createPost(post).subscribe({
      next: () => {
        this.router.navigate(['/posts']);
        this.showFormModal = false;
      },
      error: (err) => {
        console.error('Error creating post', err);
      },
    });
  }
}
