import { Component, OnInit } from '@angular/core';
import { Data } from '../../interfaces/data';
import { DataService } from '../../services/data.service';
import { Observable, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PostCreateComponent } from '../post-create/post-create.component';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PostCreateComponent,
    PaginationComponent,
  ],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit {
  posts$!: Observable<Data[]>; // Only the posts for the current page
  currentPage: number = 1;
  totalPages: number = 1;
  postsPerPage: number = 10;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    // Fetch posts for the current page and update localStorage
    this.posts$ = this.dataService
      .getAllPosts(this.currentPage, this.postsPerPage)
      .pipe(
        tap((posts) => {
          // Clear previous local storage data
          localStorage.removeItem('currentPosts');

          // Update localStorage with current page posts
          localStorage.setItem('currentPosts', JSON.stringify(posts));

          // Update total pages assuming 100 total posts (or fetch total count from API)
          this.totalPages = Math.ceil(100 / this.postsPerPage);

          console.log('Loaded posts for page', this.currentPage, posts);
        })
      );
  }

  onPageChange(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.loadPosts(); // Load new posts for the current page
    }
  }
}
