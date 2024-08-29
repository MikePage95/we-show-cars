import { faker } from '@faker-js/faker';
import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import * as serviceAccount from '../../environments/service-account.json';

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(JSON.stringify(serviceAccount))),
});

// Get Firestore instance
const firestore = getFirestore();

const createFakeVehicle = () => {
  return {
    price: faker.commerce.price({
      min: 800000,
      max: 1500000,
      dec: 0,
      symbol: 'R',
    }),
    make: faker.vehicle.manufacturer(),
    model: faker.vehicle.model(),
    body: faker.vehicle.type(),
    imageUrl: faker.image.urlLoremFlickr({ category: 'transport' }),
  };
};

const addVehicles = async () => {
  try {
    const batch = firestore.batch();

    for (let i = 0; i < 0; i++) {
      const vehicle = createFakeVehicle();
      const docRef = firestore.collection('vehicles').doc();
      batch.set(docRef, vehicle);
    }

    await batch.commit();
    console.log('Vehicles added successfully.');
  } catch (error) {
    console.error('Error adding vehicles: ', error);
  }
};

addVehicles();
