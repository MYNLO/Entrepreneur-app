<script lang="ts">
  import { pb } from '$lib/pb/client';
  import { authUser } from '$lib/stores/auth';
  import ChannelSidebar from '$lib/components/ChannelSidebar.svelte';
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';

  let stats = $state({ users: 0, messages: 0, channels: 0 });
  let topChannels = $state<{ name: string; count: number }[]>([]);
  let chartInstance: Chart | null = null;

  onMount(() => {
    if ($authUser?.role !== 'admin') {
      window.location.href = '/';
      return;
    }

    (async () => {
      try {
        const [users, messages, channels] = await Promise.all([
          pb.collection('users').getList(1, 1),
          pb.collection('messages').getList(1, 1),
          pb.collection('channels').getList(1, 1)
        ]);
        stats = {
          users: users.totalItems,
          messages: messages.totalItems,
          channels: channels.totalItems
        };

        const channelRes = await pb.collection('channels').getFullList({ fields: 'id,name' });
        const ranked = await Promise.all(
          channelRes.map(async (ch) => {
            const msgCount = await pb.collection('messages').getList(1, 1, {
              filter: `channel = "${ch.id}"`
            });
            return { name: ch.name, count: msgCount.totalItems };
          })
        );
        topChannels = ranked.sort((a, b) => b.count - a.count).slice(0, 5);
        renderChart();
      } catch (e) {
        console.error('Admin load error:', e);
      }
    })();

    return () => chartInstance?.destroy();
  });

  function renderChart() {
    const ctx = document.getElementById('activityChart') as HTMLCanvasElement | null;
    if (!ctx) return;
    chartInstance?.destroy();
    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: topChannels.map((c) => c.name),
        datasets: [
          {
            label: 'Messages',
            data: topChannels.map((c) => c.count),
            backgroundColor: 'rgb(59, 130, 246)',
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }
</script>

<div class="flex min-h-screen bg-base-100">
  <ChannelSidebar />
  <main class="flex-1 p-6">
    <h1 class="text-2xl font-bold text-on-base-100 mb-6">Admin Dashboard</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div class="bg-base-200 border border-base-300 p-4 rounded-xl">
        <p class="text-sm text-base-400">Total Members</p>
        <p class="text-3xl font-bold text-on-base-100">{stats.users}</p>
      </div>
      <div class="bg-base-200 border border-base-300 p-4 rounded-xl">
        <p class="text-sm text-base-400">Total Messages</p>
        <p class="text-3xl font-bold text-on-base-100">{stats.messages}</p>
      </div>
      <div class="bg-base-200 border border-base-300 p-4 rounded-xl">
        <p class="text-sm text-base-400">Active Channels</p>
        <p class="text-3xl font-bold text-on-base-100">{stats.channels}</p>
      </div>
    </div>

    <div class="bg-base-200 border border-base-300 p-4 rounded-xl">
      <h2 class="text-lg font-semibold text-on-base-100 mb-4">Top Channels by Activity</h2>
      <canvas id="activityChart"></canvas>
    </div>
  </main>
</div>
