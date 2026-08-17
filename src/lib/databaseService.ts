import {
  db,
  auth,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  increment,
} from './firebase';
import { UserProfile, ChatMessage, RecentTopic } from '../types';

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Alex Vance',
  email: 'alex@codemind.io',
  role: 'Computer Science Scholar',
  avatar:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD_gcUCb0rW-YDLGBO6hCnH2MhVxbqWu24ZkBR_fP5qKZBTgNuRUPoDwz1NhsO8ZiFyX0jj_U8Asru9TTyV4-hBCBPZ0h3YdpORHa0K6prJED4abUa1S8YrSkN2pFhAF0XDsyWb9PwZDIVJU-hDH4C8PI-MW5J5sGCXVI4AOHahzPFU8xhQvhveNqjXmHMA6oG9DbUrr0rJEBu6kmR2C8lKsCxvH4ranoVItM1L1LfRL1jWX_V7ykH1Hw',
  level: 4,
  streakDays: 14,
  studyHoursThisWeek: 28.5,
  dailyGoalProgress: 75,
};

// Sync or fetch user profile from Firestore
export async function syncUserProfile(uid: string, fallbackProfile?: Partial<UserProfile>): Promise<UserProfile> {
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      const data = snap.data();
      return {
        name: data.name || fallbackProfile?.name || DEFAULT_USER_PROFILE.name,
        email: data.email || fallbackProfile?.email || DEFAULT_USER_PROFILE.email,
        role: data.role || DEFAULT_USER_PROFILE.role,
        avatar: data.avatar || DEFAULT_USER_PROFILE.avatar,
        level: data.level || DEFAULT_USER_PROFILE.level,
        streakDays: data.streakDays ?? DEFAULT_USER_PROFILE.streakDays,
        studyHoursThisWeek: data.studyHoursThisWeek ?? DEFAULT_USER_PROFILE.studyHoursThisWeek,
        dailyGoalProgress: data.dailyGoalProgress ?? DEFAULT_USER_PROFILE.dailyGoalProgress,
      };
    } else {
      const newProfile: UserProfile = {
        ...DEFAULT_USER_PROFILE,
        ...fallbackProfile,
      };
      await setDoc(userRef, {
        ...newProfile,
        createdAt: serverTimestamp(),
        lastActiveAt: serverTimestamp(),
      });
      return newProfile;
    }
  } catch (error) {
    console.warn('Using local profile due to network/rules:', error);
    return { ...DEFAULT_USER_PROFILE, ...fallbackProfile };
  }
}

// Update user progress (e.g. studied a topic or increased streak)
export async function logStudySession(uid: string, hours: number, topicName: string) {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      studyHoursThisWeek: increment(hours),
      dailyGoalProgress: increment(15),
      lastActiveAt: serverTimestamp(),
    });

    // Add log
    await addDoc(collection(db, 'users', uid, 'studyLogs'), {
      topic: topicName,
      hours,
      timestamp: serverTimestamp(),
    });
  } catch (e) {
    console.error('Error logging study session:', e);
  }
}

// Save chat message into user subcollection
export async function saveChatMessage(uid: string, message: ChatMessage) {
  try {
    await addDoc(collection(db, 'users', uid, 'chats'), {
      ...message,
      createdAt: serverTimestamp(),
    });
  } catch (e) {
    console.warn('Could not persist chat message to Firestore:', e);
  }
}

// Subscribe to real-time chat history
export function subscribeChatMessages(uid: string, onUpdate: (msgs: ChatMessage[]) => void) {
  try {
    const chatRef = collection(db, 'users', uid, 'chats');
    const q = query(chatRef, orderBy('createdAt', 'asc'));
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const msgs: ChatMessage[] = snapshot.docs.map((docSnap) => {
          const d = docSnap.data();
          return {
            id: docSnap.id,
            sender: d.sender,
            text: d.text,
            codeSnippet: d.codeSnippet,
            timestamp: d.timestamp || 'Just now',
            tag: d.tag,
          };
        });
        onUpdate(msgs);
      }
    });
  } catch (e) {
    console.warn('Realtime chat subscribe fallback:', e);
    return () => {};
  }
}
