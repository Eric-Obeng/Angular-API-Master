import { Routes } from '@angular/router';
import { PostListComponent } from './components/post-list/post-list.component';
import { PostDetailsComponent } from './components/post-details/post-details.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/posts',
    pathMatch: 'full',
  },
  {
    path: 'posts',
    component: PostListComponent,
  },
  {
    path: 'post-details/:id',
    component: PostDetailsComponent,
  },
  // { path: '**', redirectTo: '/posts' },
];
