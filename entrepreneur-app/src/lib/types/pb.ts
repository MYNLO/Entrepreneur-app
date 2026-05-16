export interface User {
  id: string;
  username: string;
  email: string;
  business_name: string;
  tags: string[];
  role: 'member' | 'admin';
  subscription_status: 'active' | 'inactive' | 'grace_period';
  profile_image: string;
  contact_phone: string;
  contact_email: string;
  contact_visibility: 'public' | 'members_only' | 'admins_only';
  created: string;
}

export interface Channel {
  id: string;
  name: string;
  slug: string;
  description: string;
  required_tag: string;
  is_archived: boolean;
  created: string;
}

export interface Message {
  id: string;
  channel: string;
  author: string;
  content: string;
  attachments: string[];
  is_pinned: boolean;
  created: string;
}