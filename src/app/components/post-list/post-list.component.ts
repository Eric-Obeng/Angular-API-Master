import { Component, OnInit } from '@angular/core';
import { Data } from '../../interfaces/data';
import { DataService } from '../../services/data.service';
import { Observable, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
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
  posts$!: Observable<Data[]>;
  currentPage: number = 1;
  totalPages: number = 1;
  postsPerPage: number = 10;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    // Fetch the posts for the current page and overwrite the posts in localPosts
    this.posts$ = this.dataService
      .getAllPosts(this.currentPage, this.postsPerPage)
      .pipe(
        tap((posts) => {
          // Adjust this based on the total number of posts you expect
          this.totalPages = Math.ceil(150 / this.postsPerPage); // Set total pages based on expected post count
        })
      );
  }

  onPageChange(newPage: number): void {
    // Update current page and reload posts
    this.currentPage = newPage;
    this.loadPosts(); // Fetch the new page's posts
  }
}
