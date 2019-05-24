import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './post.model';


@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: Post[] = [];
  private postUpdated = new Subject<{ posts: Post[], postCount: number}>();

  constructor(private httpClient: HttpClient, private router: Router) { }

  getPosts(postPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postPerPage}&page=${currentPage}`;
    this.httpClient
      .get<{ message: string, posts: any, maxPosts: number }>('http://localhost:3000/api/posts' + queryParams)
      .pipe(map((postdata) => {
        return {
          posts: postdata.posts.map((post) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath
            };
          }),
          maxPosts: postdata.maxPosts
        };
      }))
      .subscribe((mappedPostsData) => {
        this.posts = mappedPostsData.posts;
        this.postUpdated.next({ posts: [...this.posts], postCount: mappedPostsData.maxPosts} );
      });
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();

    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.httpClient.post<{ message: string, post: Post }>(
      'http://localhost:3000/api/posts',
      postData
    )
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

  deletePost(id: string) {
    return this.httpClient.delete('http://localhost:3000/api/posts/' + id);
  }

  getPost(id: string) {
    return this.httpClient.get<{ _id: string, title: string, content: string, imagePath: string }>(
      'http://localhost:3000/api/posts/' + id
    );
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post |  FormData;
    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = { id, title, content, imagePath: image};
    }
    this.httpClient.put('http://localhost:3000/api/posts/' + id, postData)
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

}
