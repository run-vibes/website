import { Footer, Navbar } from '@/components/navigation'
import { Outlet, ScrollRestoration, createRootRoute } from '@tanstack/react-router'
import { Meta, Scripts } from '@tanstack/react-start/client'
import type { ReactNode } from 'react'
import '@/styles/global.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Vibes - The studio where AI agents come to life' },
      {
        name: 'description',
        content:
          'Agentic consulting & development studio delivering AI solutions with measurable impact.',
      },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </RootDocument>
  )
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Meta />
      </head>
      <body className="min-h-screen bg-background font-body text-foreground antialiased">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
