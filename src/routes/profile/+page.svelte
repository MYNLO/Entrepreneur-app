<script lang="ts">
  import { pb } from '$lib/pb/client';
  import { authUser } from '$lib/stores/auth';
  import ChannelSidebar from '$lib/components/ChannelSidebar.svelte';

  let editing = $state(false);
  let form = $state({
    business_name: '',
    contact_phone: '',
    contact_email: '',
    contact_visibility: 'members_only' as 'public' | 'members_only' | 'admins_only'
  });
  let saving = $state(false);
  let successMsg = $state('');

  $effect(() => {
    const user = $authUser;
    if (user) {
      form = {
        business_name: user.business_name || '',
        contact_phone: user.contact_phone || '',
        contact_email: user.contact_email || '',
        contact_visibility: user.contact_visibility || 'members_only'
      };
    }
  });

  async function saveProfile(e: Event) {
    e.preventDefault();
    const user = $authUser;
    if (!user) return;

    saving = true;
    try {
      await pb.collection('users').update(user.id, form);
      successMsg = 'Profile updated successfully';
      editing = false;
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      saving = false;
    }
  }
</script>

<div class="flex min-h-screen bg-base-100">
  <ChannelSidebar />
  <main class="flex-1 p-6 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold text-on-base-100 mb-6">Your Profile</h1>

    <div class="bg-base-200 border border-base-300 rounded-xl p-6 mb-4">
      <div class="flex items-center gap-4 mb-6">
        <div
          class="w-20 h-20 rounded-full bg-primary-500/20 text-primary-500 flex items-center justify-center text-2xl font-bold"
        >
          {$authUser?.business_name?.charAt(0) || 'U'}
        </div>
        <div>
          <h2 class="text-xl font-semibold text-on-base-100">{$authUser?.business_name || 'Business Name'}</h2>
          <p class="text-base-400">{$authUser?.email}</p>
        </div>
      </div>

      {#if !editing}
        <div class="space-y-3 mb-6">
          <div class="flex justify-between border-b border-base-300 pb-2">
            <span class="text-base-400">Phone</span>
            <span class="text-on-base-100">{$authUser?.contact_phone || 'Not set'}</span>
          </div>
          <div class="flex justify-between border-b border-base-300 pb-2">
            <span class="text-base-400">Email</span>
            <span class="text-on-base-100">{$authUser?.contact_email || 'Not set'}</span>
          </div>
          <div class="flex justify-between border-b border-base-300 pb-2">
            <span class="text-base-400">Visibility</span>
            <span class="text-on-base-100 capitalize">{$authUser?.contact_visibility}</span>
          </div>
        </div>
        <button
          type="button"
          onclick={() => (editing = true)}
          class="px-4 py-2 bg-base-300 text-on-base-100 rounded-lg hover:bg-base-400 transition"
        >
          Edit Profile
        </button>
      {:else}
        <form onsubmit={saveProfile} class="space-y-4">
          <div>
            <label for="business_name" class="block text-sm font-medium mb-1 text-on-base-200"
              >Business Name</label
            >
            <input
              id="business_name"
              bind:value={form.business_name}
              required
              class="w-full px-3 py-2 bg-base-100 border border-base-300 rounded-lg text-on-base-100"
            />
          </div>
          <div>
            <label for="contact_phone" class="block text-sm font-medium mb-1 text-on-base-200"
              >Contact Phone</label
            >
            <input
              id="contact_phone"
              bind:value={form.contact_phone}
              type="tel"
              class="w-full px-3 py-2 bg-base-100 border border-base-300 rounded-lg text-on-base-100"
            />
          </div>
          <div>
            <label for="contact_email" class="block text-sm font-medium mb-1 text-on-base-200"
              >Contact Email</label
            >
            <input
              id="contact_email"
              bind:value={form.contact_email}
              type="email"
              class="w-full px-3 py-2 bg-base-100 border border-base-300 rounded-lg text-on-base-100"
            />
          </div>
          <div>
            <label for="contact_visibility" class="block text-sm font-medium mb-1 text-on-base-200"
              >Contact Visibility</label
            >
            <select
              id="contact_visibility"
              bind:value={form.contact_visibility}
              class="w-full px-3 py-2 bg-base-100 border border-base-300 rounded-lg text-on-base-100"
            >
              <option value="public">Public</option>
              <option value="members_only">Members Only</option>
              <option value="admins_only">Admins Only</option>
            </select>
          </div>
          {#if successMsg}
            <p class="text-green-500 text-sm">{successMsg}</p>
          {/if}
          <div class="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              class="flex-1 px-4 py-2 bg-primary-500 text-primary-950 rounded-lg font-medium hover:bg-primary-400 disabled:opacity-50 transition"
            >
              Save
            </button>
            <button
              type="button"
              onclick={() => {
                editing = false;
                successMsg = '';
              }}
              class="px-4 py-2 bg-base-300 text-on-base-100 rounded-lg hover:bg-base-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      {/if}
    </div>
  </main>
</div>
