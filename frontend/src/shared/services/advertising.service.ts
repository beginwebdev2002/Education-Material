import { Injectable, signal, computed } from '@angular/core';
import { Ad } from '@shared/models/ad.model';

@Injectable({ providedIn: 'root' })
export class AdvertisingService {
  private readonly ADS_KEY = 'site-advertisements';
  ads = signal<Ad[]>(this.loadAds());

  activeAd = computed(() => this.ads().find(ad => ad.isActive));

  constructor() { }

  addAd(adData: Omit<Ad, 'id'>): void {
    const newAd: Ad = { ...adData, id: self.crypto.randomUUID() };
    this.ads.update(ads => [...ads, newAd]);
    this.saveAds();
  }

  updateAd(updatedAd: Ad): void {
    this.ads.update(ads => ads.map(ad => ad.id === updatedAd.id ? updatedAd : ad));
    this.saveAds();
  }

  deleteAd(adId: string): void {
    this.ads.update(ads => ads.filter(ad => ad.id !== adId));
    this.saveAds();
  }

  private loadAds(): Ad[] {
    if (typeof window !== 'undefined') {
      const savedAds = localStorage.getItem(this.ADS_KEY);
      return savedAds ? JSON.parse(savedAds) : [];
    }
    return [];
  }

  private saveAds(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.ADS_KEY, JSON.stringify(this.ads()));
    }
  }
}
