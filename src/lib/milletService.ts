import {
  collection,
  addDoc,
  getDocs,
  query,
  updateDoc,
  deleteDoc,
  doc,
  setDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { Millet } from '../types';

const COLLECTION_NAME = 'millets';

export const addMillet = async (millet: Partial<Millet> & { name: string }) => {
  try {
    const { id, ...data } = millet;
    if (id) {
      await setDoc(doc(db, COLLECTION_NAME, id), data);
      return id;
    } else {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), data);
      return docRef.id;
    }
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

export const getAllMillets = async (): Promise<Millet[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME));
    const querySnapshot = await getDocs(q);
    const millets: Millet[] = [];
    querySnapshot.forEach((doc) => {
      millets.push({ id: doc.id, ...doc.data() } as Millet);
    });
    return millets;
  } catch (e) {
    console.error("Error getting documents: ", e);
    throw e;
  }
};

export const updateMillet = async (id: string, milletData: Partial<Millet>) => {
  try {
    const milletRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(milletRef, milletData);
    console.log("Document updated");
  } catch (e) {
    console.error("Error updating document: ", e);
    throw e;
  }
};

export const deleteMillet = async (id: string) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    console.log("Document deleted");
  } catch (e) {
    console.error("Error deleting document: ", e);
    throw e;
  }
};
