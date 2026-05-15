<script lang="ts">
  import { pb } from '$lib/pb/client';
  import { goto } from '$app/navigation';
  import { rateLimitCheck } from '$lib/utils/security';

  let email = $state('');
  let password = $state('');
  let loading = $state(false);
  let errorMsg = $state('');

  async function handleLogin(e: Event) {
    e.preventDefault();
    if (!rateLimitCheck('login', 5, 60_000)) {
      errorMsg = 'Too many attempts. Please wait a minute.';
      return;
    }

    loading = true;
    errorMsg = '';

    try {
      await pb.collection('users').authWithPassword(email.trim(), password);
      goto('/');
    } catch (err: unknown) {
      errorMsg = err instanceof Error ? err.message : 'Invalid credentials';
    } finally {
      loading = false;
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-base-100 p-4">
  <div class="w-full max-w-md bg-base-200 border border-base-300 rounded-xl p-6 shadow-lg">
    <h1 class="text-2xl font-bold text-center mb-2">Entrepreneur Community</h1>
    <p class="text-base-400 text-center mb-6">Sign in to access your workspace</p>

    <form onsubmit={handleLogin} class="space-y-4">
      <div>
        <label for="email" class="block text-sm font-medium mb-1 text-on-base-200">Email</label>
        <input
          id="email"
          type="email"
          bind:value={email}
          required
          class="w-full px-3 py-2 bg-base-100 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-on-base-100 placeholder-base-400"
          placeholder="you@company.com"
        />
      </div>

      <div>
        <label for="password" class="block text-sm font-medium mb-1 text-on-base-200">Password</label>
        <input
          id="password"
          type="password"
          bind:value={password}
          required
          class="w-full px-3 py-2 bg-base-100 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-on-base-100"
        />
      </div>

      {#if errorMsg}
        <p class="text-sm text-error-500 bg-error-500/10 p-2 rounded">{errorMsg}</p>
      {/if}

      <button
        type="submit"
        disabled={loading}
        class="w-full bg-primary-500 hover:bg-primary-400 disabled:opacity-50 text-primary-950 font-medium py-2.5 rounded-lg transition"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>

    <p class="mt-4 text-center text-sm text-base-400">
      Don't have an account? Contact your administrator.
    </p>
  </div>
</div>
