import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { Post } from "../models/post.model";
import { environment } from "src/environments/environment";

@Injectable()

export class PostService{
	constructor(private http: HttpClient) {}

	getPosts(): Observable<Post[]>{
		return this.http.get<Post[]>(`${environment.apiUrl}/posts`);
	}

	addNewComment(postComment: {comment: string, postId: number}){
		this.getPosts().pipe(
			map(posts => {
				const postFound = posts.find(p => p.id == postComment.postId);
				if (postFound) {
					this.updatePost(postFound, postComment.comment).subscribe();
				}
			})
		).subscribe();
	}

	updatePost(post: Post, comment: string):Observable<Post>{
		post.comments.push({
			id: post.comments.length + 1,
			userId: post.userId,
			comment: comment,
			createdDate: ''+new Date()
		});
		return this.http.put<Post>(`${environment.apiUrl}/posts/${post.id}`, post);
	}

	
}

