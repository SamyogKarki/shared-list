# ListShare

Real-time shared lists for everyone. Create a list, get a 6-character room code, and share it with anyone — no account required. Works across iOS, Android, and desktop.

## Features

- **Instant sharing** — 6-char room code, shareable link, native share sheet on mobile
- **Real-time sync** — changes appear instantly on all connected devices
- **Drag to reorder** — smooth drag-and-drop on desktop and mobile
- **Offline-capable** — previously loaded lists work without a network connection
- **Dark mode** — follows your system preference
- **PWA** — installable on iOS, Android, and desktop

## Tech Stack

- [Next.js 16](https://nextjs.org) — App Router, TypeScript
- [Supabase](https://supabase.com) — Postgres, Realtime, Row Level Security
- [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- [@dnd-kit](https://dndkit.com) — drag-and-drop
- [Framer Motion](https://www.framer.com/motion) — animations
- [Vercel](https://vercel.com) — deployment

## Local Setup

### 1. Clone and install

```bash
git clone https://github.com/SamyogKarki/shared-list.git
cd shared-list
npm install
```

### 2. Create a Supabase project

1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project
3. Run the following SQL in the Supabase SQL editor:

```sql
create table lists (
  id uuid primary key default gen_random_uuid(),
  room_code text unique not null,
  name text default 'Untitled List',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table items (
  id uuid primary key default gen_random_uuid(),
  list_id uuid references lists(id) on delete cascade,
  text text not null,
  checked boolean default false,
  position integer not null,
  created_at timestamptz default now()
);

create index items_list_id_idx on items(list_id);

alter table lists enable row level security;
alter table items enable row level security;

create policy "Anyone can read lists" on lists for select using (true);
create policy "Anyone can insert lists" on lists for insert with check (true);
create policy "Anyone can update lists" on lists for update using (true);
create policy "Anyone can read items" on items for select using (true);
create policy "Anyone can insert items" on items for insert with check (true);
create policy "Anyone can update items" on items for update using (true);
create policy "Anyone can delete items" on items for delete using (true);

alter publication supabase_realtime add table lists;
alter publication supabase_realtime add table items;
```

### 3. Set environment variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

## Deploying to Vercel

1. Push this repo to GitHub
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Add the two environment variables above in the Vercel dashboard
4. Deploy

## License

MIT
