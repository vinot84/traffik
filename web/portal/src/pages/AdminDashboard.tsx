import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Users, FileText, TrendingUp, Shield } from 'lucide-react'
import DashboardCard from '../components/DashboardCard'

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <Routes>
        <Route path="/" element={<AdminOverview />} />
      </Routes>
    </div>
  )
}

function AdminOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700">
          System overview and administrative controls
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Citations"
          value="2,847"
          icon={FileText}
          color="blue"
        />
        <DashboardCard
          title="Active Officers"
          value="24"
          icon={Shield}
          color="green"
        />
        <DashboardCard
          title="Registered Users"
          value="1,329"
          icon={Users}
          color="purple"
        />
        <DashboardCard
          title="Revenue"
          value="$156,890"
          icon={TrendingUp}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              System Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Auth Service</span>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  Healthy
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Driver Service</span>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  Healthy
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Citation Service</span>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  Healthy
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database</span>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  Connected
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <FileText className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">New citation issued</p>
                  <p className="text-sm text-gray-500">Officer Badge #O001 • 5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">New user registered</p>
                  <p className="text-sm text-gray-500">john.doe@email.com • 12 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Payment received</p>
                  <p className="text-sm text-gray-500">Citation #CT000123 • 1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            User Management
          </h3>
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Active
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-white">AD</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">Admin User</div>
                        <div className="text-sm text-gray-500">admin@test.com</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Admin
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Administration
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    2 hours ago
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-white">OF</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">Officer Test</div>
                        <div className="text-sm text-gray-500">officer@test.com</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Officer
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Traffic
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    30 minutes ago
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}