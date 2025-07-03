import type { User } from '~/types/user.type';

export function useUsers() {
  const toast = useToast();
  const users = ref<User[]>([]);

  async function fetchUsers() {
    try {
      const data = await $fetch<User[]>('/api/users');
      users.value = data;
      return data;
    } catch (error) {
      toast.add({ title: 'Erreur lors du chargement des utilisateurs.', color: 'red' });
      return [];
    }
  }

  return {
    users,
    fetchUsers
  }
}
