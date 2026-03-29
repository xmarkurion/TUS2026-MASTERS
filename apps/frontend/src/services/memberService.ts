const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export interface Member {
  id: string;
  name: string;
  position: string;
  personalBackground?: string;
  skills: string[];
  totalCapacity: number;
  availableCapacity: number; // computed by backend: totalCapacity - active task efforts
}

export interface MemberInput {
  name: string;
  position: string;
  personalBackground?: string;
  skills: string[];
}

export const memberService = {
  findAllMembers: async (): Promise<Member[]> => {
    const response = await fetch(`${API_BASE_URL}/members/findAllMembers`);
    if (!response.ok) throw new Error('Failed to fetch members');
    return await response.json();
  },

  findByName: async (name: string): Promise<Member[]> => {
    const response = await fetch(
      `${API_BASE_URL}/members/findByName?name=${encodeURIComponent(name)}`,
    );
    if (!response.ok) throw new Error('Failed to search members');
    return await response.json();
  },

  addMember: async (member: MemberInput): Promise<Member> => {
    const response = await fetch(`${API_BASE_URL}/members/addMember`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(member),
    });
    if (!response.ok) throw new Error('Failed to add member');
    return await response.json();
  },

  updateMember: async (memberId: string, member: MemberInput): Promise<Member> => {
    const response = await fetch(`${API_BASE_URL}/members/update/${memberId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(member),
    });
    if (!response.ok) throw new Error('Failed to update member');
    return await response.json();
  },

  deleteMember: async (memberId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/members/delete/${memberId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete member');
  },
};
