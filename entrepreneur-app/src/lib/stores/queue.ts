import localforage from 'localforage';
import { pb } from '$lib/pb/client';

const queueStore = localforage.createInstance({
  name: 'msg_queue',
  storeName: 'offline_messages'
});

const QUEUE_KEY = 'messages';

export async function queueMessage(data: { channelId: string; content: string }) {
  const queue = (await queueStore.getItem(QUEUE_KEY)) || [];
  const item = { ...data, timestamp: Date.now() };
  queue.push(item);
  await queueStore.setItem(QUEUE_KEY, queue);
  return true;
}

export async function syncQueue() {
  const queue = (await queueStore.getItem(QUEUE_KEY)) || [];
  if (queue.length === 0) return 0;

  const remaining = [];
  let synced = 0;

  for (const item of queue) {
    try {
      await pb.collection('messages').create({
        channel: item.channelId,
        content: item.content
      });
      synced++;
    } catch (err) {
      remaining.push(item);
    }
  }

  await queueStore.setItem(QUEUE_KEY, remaining);
  return synced;
}

export function setupOfflineSync() {
  window.addEventListener('online', () => {
    syncQueue().then(count => {
      if (count > 0) console.log(`✅ Synced ${count} queued messages`);
    });
  });
}