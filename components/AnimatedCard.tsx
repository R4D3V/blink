'use client'

import { ReactNode, useEffect, useState } from 'react'

type Props = {
  title: string
  children: ReactNode
  icon?: ReactNode
  delay?: number
}

export default function AnimatedCard({ title, children, icon, delay = 0 }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  return (
    <div
      className={`p-6 bg-card/60 backdrop-blur rounded-lg transform transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-start gap-4">
        {icon && <div className="text-2xl mt-1">{icon}</div>}
        <div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <div className="text-slate-300">{children}</div>
        </div>
      </div>
    </div>
  )
}
