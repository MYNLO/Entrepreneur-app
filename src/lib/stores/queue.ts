import localforage from 'localforage';
import { pb } from '$lib/pb/client';

const QUEUE_KEY = 'pending';

const queueStore = localforage.createInstance({
  name: 'msg_queue',
  storeName: 'offline_messages'
});

export type QueuedMessage = {
  channelId?: string;
  conversationId?: string;
  content: string;
  timestamp: number;
};

async function readQueue(): Promise<QueuedMessage[]> {
  return (await queueStore.getItem<QueuedMessage[]>(QUEUE_KEY)) ?? [];
}

async function writeQueue(items: QueuedMessage[]) {
  await queueStore.setItem(QUEUE_KEY, items);
}

export async function queueMessage(data: {
  channelId?: string;
  conversationId?: string;
  content: string;
}) {
  const items = await readQueue();
  items.push({ ...data, timestamp: Date.now() });
  await writeQueue(items);
  return true;
}

export async function syncQueue() {
  const items = await readQueue();
  if (items.length === 0) return 0;

  const remaining: QueuedMessage[] = [];
  let synced = 0;

  for (const item of items) {
    try {
      if (item.conversationId) {
        await pb.collection('dm_messages').create({
          conversation: item.conversationId,
          content: item.content
        });
      } else if (item.channelId) {
        await pb.collection('messages').create({
          channel: item.channelId,
          content: item.content
        });
      } else {
        continue;
      }
      synced++;
    } catch {
      remaining.push(item);
    }
  }

  await writeQueue(remaining);
  return synced;
}

export function setupOfflineSync() {
  if (typeof window === 'undefined') return;

  window.addEventListener('online', () => {
    syncQueue().then((count) => {
      if (count > 0) console.log(`Synced ${count} queued messages`);
    });
  });
}
