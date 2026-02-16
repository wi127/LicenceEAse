"use client"

import { ReactNode } from "react"

interface ClientSidebarLinkProps {
  label: string
  active?: boolean
  onClick?: () => void
  icon: ReactNode
  badge?: number
}

export default function ClientSidebarLink({ label, active, onClick, icon, badge }: ClientSidebarLinkProps) {
  return (
    <button
      onClick={onClick}
      className={`sidebar-link relative w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${active
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="capitalize">{label}</span>
      </div>
      {badge && badge > 0 ? (
        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {badge}
        </span>
      ) : null}
    </button>
  )
}
