const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export interface Member {
  id: string;
  name: string;
  position: string;
  personalBackground?: string;
  skills: string[];
  availableCapacity: number;
}

export const memberService = {
  findAllMembers: async (): Promise<Member[]> => {
    const response = await fetch(`${API_BASE_URL}/members/findAllMembers`);
    if (!response.ok) throw new Error('Failed to fetch members');
    return await response.json();
  },

  updateCapacity: async (
    memberId: string,
    availableCapacity: number,
  ): Promise<Member> => {
    const response = await fetch(
      `${API_BASE_URL}/members/updatecapacity/${memberId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availableCapacity }),
      },
    );
    if (!response.ok) throw new Error('Failed to update member capacity');
    return await response.json();
  },
};
