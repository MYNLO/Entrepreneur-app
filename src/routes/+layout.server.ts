import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  return {
    session: locals.pb?.authStore?.isValid ? locals.pb.authStore.model : null
  };
};
