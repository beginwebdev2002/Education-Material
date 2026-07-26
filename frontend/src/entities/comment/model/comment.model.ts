export interface CommentAuthor {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
}

export interface Comment {
    _id: string;
    material: string | { _id: string; title: string };
    author: CommentAuthor;
    text: string;
    createdAt: string;
}
