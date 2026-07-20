import { doc, collection, setDoc, onSnapshot, type Unsubscribe } from 'firebase/firestore';
import { getFirestoreDb } from './firebase';
import { getAnonymousId } from '@/utils/anonymousId';

export interface PollVote {
  option: string;
  timestamp: number;
}

export interface PollSnapshot {
  totalVotes: number;
  optionCounts: Record<string, number>;
  userVote: string | null;
}

let _cachedDb: ReturnType<typeof getFirestoreDb> | undefined;

function db(): ReturnType<typeof getFirestoreDb> {
  if (_cachedDb === undefined) _cachedDb = getFirestoreDb();
  return _cachedDb;
}

export function subscribeToPoll(
  pollId: string,
  onData: (data: PollSnapshot) => void,
  onError: (err: Error) => void,
): Unsubscribe | null {
  if (!pollId) {
    onData({ totalVotes: 0, optionCounts: {}, userVote: null });
    return null;
  }

  const fb = db();
  if (!fb) {
    onError(new Error('Firebase not configured'));
    return null;
  }

  const userId = getAnonymousId();
  const votesRef = collection(fb, 'polls', pollId, 'votes');

  return onSnapshot(
    votesRef,
    (snapshot) => {
      const optionCounts: Record<string, number> = {};
      let userVote: string | null = null;

      snapshot.forEach((d) => {
        const vote = d.data() as PollVote;
        optionCounts[vote.option] = (optionCounts[vote.option] || 0) + 1;
        if (d.id === userId) {
          userVote = vote.option;
        }
      });

      onData({ totalVotes: snapshot.size, optionCounts, userVote });
    },
    (err: Error) => {
      onError(err);
    },
  );
}

export async function castVote(pollId: string, option: string): Promise<void> {
  if (!pollId) throw new Error('Invalid poll');

  const fb = db();
  if (!fb) throw new Error('Firebase not configured');

  const userId = getAnonymousId();
  const voteRef = doc(fb, 'polls', pollId, 'votes', userId);

  await setDoc(voteRef, { option, timestamp: Date.now() });
}
