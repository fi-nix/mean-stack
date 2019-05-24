import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostService } from '../post.service';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   {title: 'First post', content: 'This is the first compoent\'s content'},
  //   {title: 'Second post', content: 'This is the second compoent\'s content'},
  //   {title: 'Third post', content: 'This is the third compoent\'s content'},
  // ];

  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  private postsSub: Subscription;

  constructor(public postService: PostService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.postPerPage, this.currentPage);
    this.postsSub = this.postService.getPostUpdateListener()
      .subscribe((postData: { posts: Post[], postCount: number}) => {
        this.isLoading = false;
        this.posts = postData.posts;
        this.totalPosts = postData.postCount;
      });
  }

  onChangedPage(page: PageEvent) {
    this.isLoading = true;
    this.currentPage = page.pageIndex + 1;
    this.postPerPage = page.pageSize;
    this.postService.getPosts(this.postPerPage, this.currentPage);
  }

  onDelete(id: string) {
    this.postService.deletePost(id).subscribe(() => {
      this.postService.getPosts(this.postPerPage, this.currentPage);
    });
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }

}
