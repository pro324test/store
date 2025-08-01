"use client"

import { AuthenticatedLayout } from './authenticated-layout'
import { Header } from './header'
import { Main } from './main'

interface AdminLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
}

export function NewAdminLayout({ children, title, description }: AdminLayoutProps) {
  return (
    <AuthenticatedLayout>
      <Header>
        <div className="flex-1">
          {title && (
            <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </Header>
      <Main>
        {children}
      </Main>
    </AuthenticatedLayout>
  )
}