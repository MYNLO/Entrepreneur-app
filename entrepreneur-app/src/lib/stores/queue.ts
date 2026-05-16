import { writable } from 'svelte/store';
import localforage from 'localforage';

export const offlineQueue = writable<any[]>([]);

export async function createOfflineMessage(record: any, collection: string = 'messages') {
	const queue: any[] = (await localforage.getItem('offlineMessages')) || [];
	queue.push({ collection, record, timestamp: new Date().toISOString() });
	await localforage.setItem('offlineMessages', queue);
	offlineQueue.set(queue);
}

export async function processOfflineQueue(pb: any) {
	const queue: any[] = (await localforage.getItem('offlineMessages')) || [];
	if (queue.length === 0) return;

	for (let i = queue.length - 1; i >= 0; i--) {
		const item = queue[i];
		try {
			await pb.collection(item.collection).create(item.record);
			queue.splice(i, 1);
		} catch (err) {
			console.error(`Failed to send offline message to ${item.collection}`, err);
		}
	}

	await localforage.setItem('offlineMessages', queue);
	offlineQueue.set(queue);
}

export function setupOfflineSync(pb: any) {
	if (typeof window === 'undefined') return;

	const handleOnline = () => processOfflineQueue(pb);
	window.addEventListener('online', handleOnline);

	if (navigator.onLine) {
		processOfflineQueue(pb);
	}

	return () => window.removeEventListener('online', handleOnline);
}