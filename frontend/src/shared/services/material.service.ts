import { Injectable, signal } from '@angular/core';
import { Material } from '../models/material.model';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MockMaterialService {
  private mockMaterials: Material[] = [
    { id: 'mat-001', title: 'Introduction to Angular Signals', authorId: 'f8b8f4a2-7c1b-4f4e-8e3a-3e4d5f6g7h8i', authorName: 'Alex Doe', rating: 5, downloads: 1250, description: 'A comprehensive guide to the new reactive primitive in Angular.', reviews: 45, isPublic: true },
    { id: 'mat-002', title: 'Advanced Tailwind CSS Techniques', authorId: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6', authorName: 'Jane Smith', rating: 4, downloads: 850, description: 'Learn how to build complex layouts and custom components with Tailwind.', reviews: 22, isPublic: true },
    { id: 'mat-003', title: 'Feature Sliced Design in Practice', authorId: 'f8b8f4a2-7c1b-4f4e-8e3a-3e4d5f6g7h8i', authorName: 'Alex Doe', rating: 5, downloads: 2100, description: 'A practical approach to structuring large-scale frontend applications.', reviews: 78, isPublic: false },
    { id: 'mat-004', title: 'Getting Started with Zoneless Angular', authorId: 'b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7', authorName: 'Chris Lee', rating: 3, downloads: 450, description: 'Explore the future of Angular change detection.', reviews: 10, isPublic: true },
    { id: 'mat-005', title: 'UI/UX Principles for Developers', authorId: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6', authorName: 'Jane Smith', rating: 4, downloads: 1500, description: 'Key design principles that every developer should know.', reviews: 30, isPublic: true }
  ];

  materials = signal<Material[]>(this.mockMaterials);

  getMaterials() {
    return of(this.materials());
  }

  getMaterialById(id: string) {
    return of(this.materials().find(m => m.id === id));
  }

  getMaterialsByAuthor(authorId: string) {
    return of(this.materials().filter(m => m.authorId === authorId));
  }
}