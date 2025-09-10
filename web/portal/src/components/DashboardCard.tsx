import React from 'react'
import { LucideIcon } from 'lucide-react'

interface DashboardCardProps {
  title: string
  value: string
  icon: LucideIcon
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'red'
}

const colorClasses = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  purple: 'bg-purple-500',
  red: 'bg-red-500'
}

export default function DashboardCard({ title, value, icon: Icon, color }: DashboardCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`h-8 w-8 ${colorClasses[color]} rounded-md flex items-center justify-center`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="text-lg font-medium text-gray-900">{value}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}