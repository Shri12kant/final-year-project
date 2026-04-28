export type CommunityInfo = {
  slug: string
  name: string
  description: string
  rules: string[]
  memberCount: number
  accent: string
}

export const COMMUNITIES: CommunityInfo[] = [
  {
    slug: 'web-dev',
    name: 'Web Development',
    description: 'React, Vite, Spring Boot, REST APIs — projects, doubts, best practices.',
    rules: ['Be respectful', 'No spam', 'Use code blocks for long snippets'],
    memberCount: 12800,
    accent: 'from-indigo-500/20 to-teal-500/20',
  },
  {
    slug: 'java',
    name: 'Java & Spring',
    description: 'Spring Boot, JPA, security, assignments, interview prep.',
    rules: ['Search before posting', 'Share error + stack trace'],
    memberCount: 9400,
    accent: 'from-orange-500/20 to-red-500/20',
  },
  {
    slug: 'ai-ml',
    name: 'AI / ML',
    description: 'Models, datasets, basics for students — keep it academic.',
    rules: ['Cite sources', 'No plagiarism'],
    memberCount: 7200,
    accent: 'from-violet-500/20 to-fuchsia-500/20',
  },
  {
    slug: 'dbms',
    name: 'DBMS',
    description: 'SQL, MySQL, normalization, transactions, indexes.',
    rules: ['Paste schema when asking SQL questions'],
    memberCount: 5100,
    accent: 'from-emerald-500/20 to-cyan-500/20',
  },
  {
    slug: 'general',
    name: 'General',
    description: 'Announcements, meta, anything that does not fit elsewhere.',
    rules: ['Stay on topic for other communities when cross-posting'],
    memberCount: 21000,
    accent: 'from-slate-500/20 to-zinc-500/20',
  },
]

export function getCommunity(slug: string | undefined): CommunityInfo | undefined {
  if (!slug) return undefined
  return COMMUNITIES.find((c) => c.slug === slug)
}
