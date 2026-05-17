<script lang="ts">
  import { pb } from '$lib/pb/client';
  import { goto } from '$app/navigation';

  let email = '';
  let password = '';
  let loading = false;
  let errorMsg = '';

  async function handleLogin(e: Event) {
    e.preventDefault();
    loading = true;
    errorMsg = '';

    try {
      await pb.collection('users').authWithPassword(email.trim(), password);
      goto('/');
    } catch (err: any) {
      errorMsg = err.message || 'Invalid credentials';
    } finally {
      loading = false;
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-surface-100 p-4">
  <div class="w-full max-w-md bg-surface-200 border border-surface-300 rounded-xl p-6 shadow-lg">
    <h1 class="text-2xl font-bold text-center mb-2 text-surface-950">Entrepreneur Community</h1>
    <p class="text-surface-400 text-center mb-6">Sign in to access your workspace</p>

    <form on:submit={handleLogin} class="space-y-4">
      <div>
        <label for="login-email" class="block text-sm font-medium mb-1 text-surface-950">Email</label>
        <input
          id="login-email"
          type="email"
          bind:value={email}
          required
          class="w-full px-3 py-2 bg-surface-100 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-surface-950 placeholder-surface-400"
          placeholder="you@company.com"
        />
      </div>

      <div>
        <label for="login-password" class="block text-sm font-medium mb-1 text-surface-950">Password</label>
        <input
          id="login-password"
          type="password"
          bind:value={password}
          required
          class="w-full px-3 py-2 bg-surface-100 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-surface-950"
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

    <p class="mt-4 text-center text-sm text-surface-400">
      Don't have an account? Contact your administrator.
    </p>
  </div>
</div>
