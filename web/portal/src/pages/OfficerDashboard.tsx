import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { FileText, MapPin, Users, BarChart3 } from 'lucide-react'
import DashboardCard from '../components/DashboardCard'
import CitationList from '../components/CitationList'
import CreateCitation from '../components/CreateCitation'

export default function OfficerDashboard() {
  return (
    <div className="space-y-6">
      <Routes>
        <Route path="/" element={<OfficerOverview />} />
        <Route path="/citations" element={<CitationList />} />
        <Route path="/create-citation" element={<CreateCitation />} />
      </Routes>
    </div>
  )
}

function OfficerOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Officer Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700">
          Manage citations and view your daily activities
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Today's Citations"
          value="12"
          icon={FileText}
          color="blue"
        />
        <DashboardCard
          title="Active Patrol"
          value="On Duty"
          icon={MapPin}
          color="green"
        />
        <DashboardCard
          title="Pending Reviews"
          value="3"
          icon={Users}
          color="yellow"
        />
        <DashboardCard
          title="This Week"
          value="48"
          icon={BarChart3}
          color="purple"
        />
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button className="relative block w-full bg-white p-6 border-2 border-gray-300 border-dashed rounded-lg text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Create New Citation
              </span>
            </button>
            
            <button className="relative block w-full bg-white p-6 border-2 border-gray-300 border-dashed rounded-lg text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <MapPin className="mx-auto h-12 w-12 text-gray-400" />
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Update Location
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Recent Citations
          </h3>
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Citation #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Driver
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Violation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      CT{String(i).padStart(6, '0')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      John Doe
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Speeding
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      $150.00
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Issued
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}