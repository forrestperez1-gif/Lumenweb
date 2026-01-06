Prompt for Codex 5.2 High

You are an expert frontend engineer working on an AI learning companion called Lumen.
Lumen's core idea: users talk to it the way they talk to a close friend who understands their favorite topic, and Lumen helps them think more clearly, not just answer short questions.

We want to redesign the first run onboarding so that instead of a long configuration wizard, users immediately experience what it feels like to talk about something they care about in their own language and get a useful response.

Tone and UX constraints
- Audience: teens and adults, including skeptical adults.
- Voice: calm, grounded, respectful, no hype.
- No emojis, no exclamation marks.
- Assume the user is smart and already knows a lot about at least one thing (cars, games, music, sports, business, a niche hobby, etc.).
- The UI should encourage messy, real language, jargon, half finished thoughts, and shop talk with the system, not polite textbook questions.

Goal
Replace the existing five step companion builder intro with a show then do flow:
1) Show short examples of how a deep dive conversation with Lumen looks (user talks about something they love in their own jargon; Lumen structures and responds).
2) Immediately invite the user to try it themselves.
3) Only after the first useful exchange, optionally ask about interaction style (guide / co explorer / teacher), not before.

The main success metric is time to first meaningful exchange, not how many settings they configure.

Screens to implement
Implement this as a small set of React and TypeScript screens and components that can be wired into an existing web app. You can assume Expo Router or a similar routing system, but keep components relatively self contained.

Screen 0 - Title card (optional but simple)
Goal: set the metaphor quickly; user should be able to skip.
- Header: Talk to me about the thing you know too much about
- Subhead: Use the same language you use with a friend who actually gets it
- Primary CTA: Start
- Secondary CTA: Skip (go straight to main chat)

Small line at the bottom:
- You do not need the right prompt. You just need your real question.

This screen is optional and should be dismissible instantly.

Screen 1 - Example deep dive conversations (Show)
Goal: demonstrate the behavior we want from the user.
- Header: This is what a good conversation with me looks like
- Body lines:
  - You talk about your thing the way you really talk about it.
  - Use your jargon. Use half finished thoughts. Do not simplify for school.
  - Ask the question you would not even know how to search for.

UI:
- A small, swipeable or tabbed demo thread component with two to three example exchanges (User -> Lumen).
- A category toggle (buttons or tabs) so the user can switch example flavor:
  - Cars / fixing things
  - Games
  - Music / art
  - Business / work (or similar)

Each demo is two to three bubbles max:

Example A - Cars / mechanic flavor
- User bubble:
  "Launch is inconsistent when the track is cold. Same tire pressure, same RPM. Sometimes it hooks, sometimes it just spins. What am I missing?"
- Lumen bubble:
  "Let's treat this as a mix of weight transfer and surface temperature. I'll ask a couple of quick checks, then suggest two experiments you can try on your next run."

Example B - Games flavor
- User bubble:
  "On this map it feels like shots do not register when I hold tight angles. I feel like I shoot first and still lose."
- Lumen bubble:
  "That's usually a mix of latency, peekers' advantage, and server tick rate. I'll explain it in game terms first, then show you what is happening under the hood."

Example C - Knowledge worker flavor
- User bubble:
  "Our funnel drop off only happens on mobile Safari after step two. Nothing else changed. I cannot isolate why."
- Lumen bubble:
  "Let's brainstorm failure modes: tracking, layout regressions, caching, and cohort changes. I'll walk through a clean debug path."

CTAs:
- Primary: Your turn -> navigates to input screen.
- Secondary: Not sure what to talk about? -> opens a lightweight helper screen.

Screen 1.5 - Find your home turf (optional helper)
Goal: help users who do not know what to talk about pick something they can actually go deep on.
- Header: What could you talk about for 10 minutes without notes
- Body: Pick anything. We can translate it into school topics later.

Show a grid of selectable chips (multi line buttons):
- Cars / fixing things
- Games
- Music / art
- Sports
- Cooking / fitness
- Business / money
- A niche rabbit hole
- Something I am obsessed with but do not talk about much

Primary CTA: Continue -> pre fills a starter phrase in the next screen or at least stores the home turf label so we can attach it to the first conversation.

If the user never opens this helper, the main flow still works.

Screen 2 - Deep dive input box (Do)
Goal: first real input. This is the text box where they talk about their home turf in their own language.
- Header: Talk to me like you are talking to someone who already gets it
- Body: Describe what you are trying to figure out, what feels weird, or what is not working, in your own words.

Input:
- One large multiline text area.
- Placeholder text should gently scaffold, rotating through prompts like:
  - Here is what I am trying to do...
  - Here is the part that does not make sense...
  - I tried X and got Y. I expected Z.
  - What am I missing?

Under the box, provide small nudge chips that insert labels when clicked (they can append text like "Context: " into the input):
- Context: ...
- Symptoms: ...
- What I have tried: ...
- My guess: ...
- What I want: ...
- Question: What am I missing?

Tiny permission text under the chips:
- Messy is good. Your own slang is good. You can swear.

CTAs:
- Primary: Send (or Talk to me ->)
- Secondary: Show me another example (takes them back to Screen 1 / rotates demo)

On submit:
- Send the text to the existing assistant or chat endpoint as the user's first message.
- Attach any selected home turf label as metadata if the app supports it.

First response behavior (backend / assistant side)
You do not need to implement the model itself here, but the UI should assume the assistant will respond with this pattern and support it:
1) Mirror:
   The assistant first restates what it thinks the user is asking, in their language.
   "It sounds like you are trying to understand why your car launches inconsistently when the track is cold even though your settings are the same."
2) Clarify (max two quick questions):
   "Before I guess, two quick checks: [question 1], [question 2]."
3) Explain in user terms first:
   Use their domain language and analogies they would naturally use.
4) Offer optional underlying lenses:
   At the end, a small line like:
   "If you want the under the hood view, this mostly lives in [physics] and [data] terms."
5) Offer mode choice for how to continue:
   "Do you want a quick fix path, a deeper theory path, or a teach me while we solve it path?"

The UI should be ready to show this response in the normal chat format.

Optional: Post answer style picker (replacing five step builder)
After the first meaningful answer (not before), optionally show a simple modal asking how the user wants Lumen to behave going forward.

Modal:
- Title: How do you want me to ride along
- Options (buttons):
  - Co driver - Be direct and decisive; help me make choices.
  - Pit crew - Give me step by step checklists and sanity checks.
  - Professor - Connect this to underlying concepts and teach as we go.
- Footer: You can change this anytime in settings.

This replaces the old five step configuration flow; it should be brief and skippable.

Implementation notes
- Use idiomatic React and TypeScript.
- Structure screens as separate components that can be routed:
  - IntroTitleScreen
  - ExampleConversationsScreen
  - HomeTurfHelperScreen (optional)
  - DeepDiveInputScreen
- Keep styling simple but clean and consistent with a modern, minimal UI:
  - plenty of spacing,
  - clear hierarchy,
  - buttons with obvious primary vs secondary emphasis.
- All user facing text must follow the tone rules above: no emojis, no hype, no fake enthusiasm.

Use this spec to generate the components, routes, and any supporting types you need. If something is ambiguous, make a reasonable choice and document it in comments so it can be adjusted later.
