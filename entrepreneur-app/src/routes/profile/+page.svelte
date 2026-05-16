<script lang="ts">
  import { pb } from '$lib/pb/client';
  import { authUser } from '$lib/stores/auth';
  import ChannelSidebar from '$lib/components/ChannelSidebar.svelte';
  import { onMount } from 'svelte';

  let user = $authUser;
  let editing = false;
  let form = { business_name: '', contact_phone: '', contact_email: '', contact_visibility: 'members_only' };
  let saving = false;
  let successMsg = '';

  onMount(() => {
    if (user) {
      form = {
        business_name: user.business_name || '',
        contact_phone: user.contact_phone || '',
        contact_email: user.contact_email || '',
        contact_visibility: user.contact_visibility || 'members_only'
      };
    }
  });

  async function saveProfile() {
    if (!user) return;
    saving = true;
    try {
      await pb.collection('users').update(user.id, form);
      successMsg = 'Profile updated successfully';
      editing = false;
    } catch (e: any) {
      alert(e.message || 'Failed to update');
    } finally {
      saving = false;
    }
  }
</script>

<div class="flex min-h-screen bg-surface-100">
  <ChannelSidebar />
  <main class="flex-1 p-6 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold text-surface-950 mb-6">Your Profile</h1>

    <div class="bg-surface-200 border border-surface-300 rounded-xl p-6 mb-4">
      <div class="flex items-center gap-4 mb-6">
        <div class="w-20 h-20 rounded-full bg-primary-500/20 text-primary-500 flex items-center justify-center text-2xl font-bold">
          {user?.business_name?.charAt(0) || 'U'}
        </div>
        <div>
          <h2 class="text-xl font-semibold text-surface-950">{user?.business_name || 'Business Name'}</h2>
          <p class="text-surface-400">{user?.email}</p>
        </div>
      </div>

      {#if !editing}
        <div class="space-y-3 mb-6">
          <div class="flex justify-between border-b border-surface-300 pb-2"><span class="text-surface-400">Phone</span><span class="text-surface-950">{user?.contact_phone || 'Not set'}</span></div>
          <div class="flex justify-between border-b border-surface-300 pb-2"><span class="text-surface-400">Email</span><span class="text-surface-950">{user?.contact_email || 'Not set'}</span></div>
          <div class="flex justify-between border-b border-surface-300 pb-2"><span class="text-surface-400">Visibility</span><span class="text-surface-950 capitalize">{user?.contact_visibility}</span></div>
        </div>
        <button on:click={() => editing = true} class="px-4 py-2 bg-surface-300 text-surface-950 rounded-lg hover:bg-surface-400 transition">Edit Profile</button>
      {:else}
        <form on:submit|preventDefault={saveProfile} class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1 text-surface-950">Business Name</label>
            <input bind:value={form.business_name} required class="w-full px-3 py-2 bg-surface-100 border border-surface-300 rounded-lg text-surface-950" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1 text-surface-950">Contact Phone</label>
            <input bind:value={form.contact_phone} type="tel" class="w-full px-3 py-2 bg-surface-100 border border-surface-300 rounded-lg text-surface-950" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1 text-surface-950">Contact Email</label>
            <input bind:value={form.contact_email} type="email" class="w-full px-3 py-2 bg-surface-100 border border-surface-300 rounded-lg text-surface-950" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1 text-surface-950">Contact Visibility</label>
            <select bind:value={form.contact_visibility} class="w-full px-3 py-2 bg-surface-100 border border-surface-300 rounded-lg text-surface-950">
              <option value="public">Public</option>
              <option value="members_only">Members Only</option>
              <option value="admins_only">Admins Only</option>
            </select>
          </div>
          {#if successMsg}<p class="text-green-500 text-sm">{successMsg}</p>{/if}
          <div class="flex gap-2">
            <button type="submit" disabled={saving} class="flex-1 px-4 py-2 bg-primary-500 text-primary-950 rounded-lg font-medium hover:bg-primary-400 disabled:opacity-50 transition">Save</button>
            <button type="button" on:click={() => { editing = false; successMsg = ''; }} class="px-4 py-2 bg-surface-300 text-surface-950 rounded-lg hover:bg-surface-400 transition">Cancel</button>
          </div>
        </form>
      {/if}
    </div>
  </main>
</div>