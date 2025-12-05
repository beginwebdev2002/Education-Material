import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

interface Activity {
  user: string;
  avatar: string;
  action: string;
  target: string;
  time: Date;
}

@Component({
  selector: 'app-dashboard-overview-page',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './dashboard-overview.page.component.html',
  styleUrls: ['./dashboard-overview.page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardOverviewPageComponent {
  // Mock data for recent activity feed
  recentActivities: Activity[] = [
    { user: 'Alex Doe', avatar: 'https://i.pravatar.cc/150?u=alex', action: 'generated a new material:', target: 'Intro to Quantum Physics', time: new Date(Date.now() - 5 * 60000) },
    { user: 'Chris Lee', avatar: 'https://i.pravatar.cc/150?u=chris', action: 'registered a new account', target: '', time: new Date(Date.now() - 15 * 60000) },
    { user: 'Umarali Yuldoshev', avatar: 'https://i.pravatar.cc/150?u=jane', action: 'banned the material:', target: 'Spam Content', time: new Date(Date.now() - 32 * 60000) },
    { user: 'Alex Doe', avatar: 'https://i.pravatar.cc/150?u=alex', action: 'updated their profile', target: '', time: new Date(Date.now() - 45 * 60000) },
    { user: 'Maria Garcia', avatar: 'https://i.pravatar.cc/150?u=maria', action: 'downloaded a material:', target: 'Advanced Tailwind CSS', time: new Date(Date.now() - 58 * 60000) },
  ];
}
