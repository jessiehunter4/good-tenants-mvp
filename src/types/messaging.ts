
import { Database } from "@/integrations/supabase/types";

export type Message = {
  id: string;
  thread_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
  sender?: {
    email: string;
    role: string;
  };
};

export type MessageThread = {
  id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
  listing_id: string | null;
  property_showing_id: string | null;
  thread_type: string;
  participants?: ThreadParticipant[];
  last_message?: Message;
  unread_count?: number;
};

export type ThreadParticipant = {
  id: string;
  thread_id: string;
  user_id: string;
  role: string;
  joined_at: string;
  left_at: string | null;
  is_muted: boolean;
  user?: {
    email: string;
    profile?: any;
  };
};

export type ThreadType = 'general' | 'showing' | 'application' | 'transaction';

export type ParticipantRole = 'tenant' | 'agent' | 'landlord' | 'admin' | 'system';

export type ShowingStatus = 'requested' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';

export interface ThreadCreateParams {
  title?: string;
  thread_type?: ThreadType;
  listing_id?: string;
  property_showing_id?: string;
  participants: {
    user_id: string;
    role: ParticipantRole;
  }[];
  initial_message?: string;
}
