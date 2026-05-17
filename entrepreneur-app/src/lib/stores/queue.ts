import { writable } from 'svelte/store';
import localforage from 'localforage';
import type { RecordModel } from 'pocketbase';

type QueueItem = {
	collection: string;
	record: RecordModel;
	timestamp: string;
};

export const offlineQueue = writable<QueueItem[]>([]);

export async function createOfflineMessage(
	record: RecordModel,
	collection: string = 'messages'
) {
	const queue: QueueItem[] = (await localforage.getItem('offlineMessages')) || [];
	const item: QueueItem = {
		collection,
		record,
		timestamp: new Date().toISOString()
	};

	queue.push(item);
	await localforage.setItem('offlineMessages', queue);
	offlineQueue.set(queue);
}

export async function processOfflineQueue(pb: any) {
	const queue: QueueItem[] = (await localforage.getItem('offlineMessages')) || [];
	if (queue.length === 0) return;

	for (let i = queue.length - 1; i >= 0; i--) {
		const item = queue[i];
		try {
			await pb.collection(item.collection).create(item.record);
			queue.splice(i, 1);
		} catch (err) {
			console.error(`Failed to send offline message to ${item.collection}`, err);
			// Keep failed items in queue for next attempt
		}
	}

	await localforage.setItem('offlineMessages', queue);
	offlineQueue.set(queue);
}

export function setupOfflineSync(pb: any) {
	if (typeof window === 'undefined') return;

	const handleOnline = () => processOfflineQueue(pb);
	window.addEventListener('online', handleOnline);

	// Process immediately if already online
	if (navigator.onLine) {
		processOfflineQueue(pb);
	}

	return () => window.removeEventListener('online', handleOnline);
}