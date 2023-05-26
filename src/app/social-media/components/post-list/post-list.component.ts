import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post.services';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})

export class PostListComponent implements OnInit {

  posts$!: Observable<Post[]>;

  user = {lastName: "Mangane", firstName: "abdoulaye"};
  constructor(private route: ActivatedRoute,
              private postService: PostService) { }

  ngOnInit(): void {
    this.posts$ = this.route.data.pipe(
      map(data => data['posts'])
    )
  }

  onPostCommented(postCommented: {comment: string, postId: number}){
      this.postService.addNewComment(postCommented);
  }

}

