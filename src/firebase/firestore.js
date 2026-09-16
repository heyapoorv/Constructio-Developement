import { db } from './config';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';

// ==========================================
// PROJECTS
// ==========================================

export const getPublishedProjects = async () => {
  const q = query(collection(db, 'projects'), where('published', '==', true), orderBy('displayOrder', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getAllProjects = async () => {
  const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getProject = async (id) => {
  const docRef = doc(db, 'projects', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
};

export const createProject = async (data) => {
  return await addDoc(collection(db, 'projects'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

export const updateProject = async (id, data) => {
  const docRef = doc(db, 'projects', id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
};

export const deleteProject = async (id) => {
  const docRef = doc(db, 'projects', id);
  await deleteDoc(docRef);
};

// ==========================================
// ENQUIRIES
// ==========================================

export const createEnquiry = async (data) => {
  return await addDoc(collection(db, 'enquiries'), {
    ...data,
    status: 'new',
    createdAt: serverTimestamp()
  });
};

export const getEnquiries = async () => {
  const q = query(collection(db, 'enquiries'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateEnquiryStatus = async (id, status) => {
  const docRef = doc(db, 'enquiries', id);
  await updateDoc(docRef, { status });
};

export const deleteEnquiry = async (id) => {
  const docRef = doc(db, 'enquiries', id);
  await deleteDoc(docRef);
};

// ==========================================
// TESTIMONIALS
// ==========================================

export const getPublishedTestimonials = async () => {
  const q = query(collection(db, 'testimonials'), where('published', '==', true), orderBy('displayOrder', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getAllTestimonials = async () => {
  const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const createTestimonial = async (data) => {
  return await addDoc(collection(db, 'testimonials'), {
    ...data,
    createdAt: serverTimestamp()
  });
};

export const updateTestimonial = async (id, data) => {
  const docRef = doc(db, 'testimonials', id);
  await updateDoc(docRef, data);
};

export const deleteTestimonial = async (id) => {
  const docRef = doc(db, 'testimonials', id);
  await deleteDoc(docRef);
};

// ==========================================
// SITE SETTINGS
// ==========================================

export const getSiteSettings = async () => {
  const docRef = doc(db, 'settings', 'global');
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
};

export const updateSiteSettings = async (data) => {
  const docRef = doc(db, 'settings', 'global');
  await updateDoc(docRef, data);
};
