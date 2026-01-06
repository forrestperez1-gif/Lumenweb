import type { SeedTraits } from '../stores/companionStore';

export type ChatRequest = {
  message: string;
  seedTraits?: SeedTraits | null;
  // Legacy fields for backward compatibility
  homeTurf?: string | null;
  style?: string | null;
};

export type ChatResponse = {
  reply: string;
};

const CHAT_ENDPOINT = process.env.EXPO_PUBLIC_CHAT_ENDPOINT;

export async function sendChat(req: ChatRequest): Promise<ChatResponse> {
  if (!CHAT_ENDPOINT) {
    // Mock response that mirrors the companion's tone based on seed traits
    const dynamic = req.seedTraits?.relationshipDynamic || 'real';
    const mockResponses: Record<string, string> = {
      guide: `That's a fascinating starting point. "${req.message}" touches on something deeper than it first appears.\n\nLet me help you find a path in. There are a few angles we could take:\n\n1. The "how" angle — what mechanisms or processes are actually at work here?\n2. The "why" angle — what purpose does this serve, or what problem does it solve?\n3. The "when" angle — how has this changed over time, and where might it be going?\n\nWhich feels most interesting to you right now?`,
      coexplorer: `"${req.message}" — I've wondered about that too, actually.\n\nI don't have a clean answer ready, but I have some hunches. The thing that strikes me is that most people never even think to ask this. They just accept it as background.\n\nWhat made you curious about it? Was there a moment, or has it been building for a while?`,
      challenger: `Alright, "${req.message}" — let's see what you've got.\n\nBefore I give you anything, tell me: what's your current theory? Even a rough one. I want to know where you're starting from so I can push you in a useful direction.\n\nDon't worry about being wrong. Being wrong is where the learning happens.`,
      real: `"${req.message}" — good question.\n\nHonestly, this is one of those things that has multiple layers. The surface answer is probably something you could find with a quick search. But I'm guessing you're not here for the surface answer.\n\nWhat specifically about this is nagging at you?`,
    };
    return { reply: mockResponses[dynamic] || mockResponses.real };
  }

  const res = await fetch(CHAT_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to send chat');
  }

  const data = (await res.json()) as ChatResponse;
  return data;
}
