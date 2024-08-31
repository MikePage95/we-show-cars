import { Injectable, inject } from '@angular/core';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';

@Injectable()
export class HomeService {
  private firestore: Firestore = inject(Firestore);
  constructor() {}

  getVehicles() {
    const vehiclesCollection = collection(this.firestore, 'vehicles');
    return collectionData(vehiclesCollection);
  }
}
