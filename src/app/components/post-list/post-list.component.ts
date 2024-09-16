import { Component, OnInit } from '@angular/core';
import { Data } from '../../interfaces/data';
import { DataService } from '../../services/data.service';
import { Observable, tap, switchMap } from 'rxjs';
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
  posts$: Observable<Data[]> = this.dataService.getLocalPosts();
  currentPage: number = 1;
  totalPages: number = 1;
  postsPerPage: number = 10;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.dataService.getLocalPosts().pipe(
      switchMap((posts) => {
        const totalPosts = posts.length;
        this.totalPages = Math.ceil(100 / this.postsPerPage);
        console.log('Total Pages:', this.totalPages); // Debugging
        return this.dataService.getAllPosts(this.currentPage, this.postsPerPage);
      }),
      tap((posts) => {
        console.log('Posts loaded:', posts);
      })
    ).subscribe();
  }

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.loadPosts();
  }
}
