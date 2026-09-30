import { profile } from '../data/profile'
import GitHubMark from './icons/GitHubMark'
import LinkedInMark from './icons/LinkedInMark'
import TwitterMark from './icons/TwitterMark'

// Order matches how the three are declared in profile.links. Each entry only
// renders if its URL is non-empty — profile.links.twitter is deliberately
// blank right now, so that icon simply doesn't appear.
const SOCIAL = [
  { key: 'linkedin', Icon: LinkedInMark, label: 'LinkedIn' },
  { key: 'github', Icon: GitHubMark, label: 'GitHub' },
  { key: 'twitter', Icon: TwitterMark, label: 'Twitter' },
]

export default function Footer() {
  const links = SOCIAL.filter(({ key }) => profile.links[key])

  return (
    <footer className="border-t border-border px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="text-sm text-ink-muted">
          <a href={`mailto:${profile.email}`} className="font-medium text-ink hover:text-primary">
            {profile.email}
          </a>
          <span className="mx-2" aria-hidden="true">
            ·
          </span>
          {profile.location}
        </div>

        {links.length > 0 && (
          <ul className="flex items-center gap-3">
            {links.map(({ key, Icon, label }) => (
              <li key={key}>
                <a
                  href={profile.links[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-full border border-border text-ink-muted transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </footer>
  )
}
