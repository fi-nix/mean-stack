import { Component, OnInit, OnDestroy } from '@angular/core';
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
  private postsSub: Subscription;

  constructor(public postService: PostService) {}

  ngOnInit() {
    this.postService.getPosts();
    this.postsSub = this.postService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
  }

  onDelete(id: string) {
    this.postService.deletePost(id);
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }

}
