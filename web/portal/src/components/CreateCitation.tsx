import React, { useState } from 'react'

export default function CreateCitation() {
  const [formData, setFormData] = useState({
    driverLicense: '',
    licenseState: '',
    violationType: '',
    description: '',
    fineAmount: '',
    location: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    licensePlate: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Citation data:', formData)
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Create New Citation
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Driver Information */}
            <div className="col-span-2">
              <h4 className="text-md font-medium text-gray-900 mb-3">Driver Information</h4>
            </div>
            
            <div>
              <label htmlFor="driverLicense" className="block text-sm font-medium text-gray-700">
                Driver License Number
              </label>
              <input
                type="text"
                name="driverLicense"
                id="driverLicense"
                value={formData.driverLicense}
                onChange={handleInputChange}
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label htmlFor="licenseState" className="block text-sm font-medium text-gray-700">
                License State
              </label>
              <select
                name="licenseState"
                id="licenseState"
                value={formData.licenseState}
                onChange={handleInputChange}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              >
                <option value="">Select State</option>
                <option value="CA">California</option>
                <option value="NY">New York</option>
                <option value="TX">Texas</option>
                <option value="FL">Florida</option>
              </select>
            </div>

            {/* Vehicle Information */}
            <div className="col-span-2">
              <h4 className="text-md font-medium text-gray-900 mb-3 mt-6">Vehicle Information</h4>
            </div>

            <div>
              <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700">
                License Plate
              </label>
              <input
                type="text"
                name="licensePlate"
                id="licensePlate"
                value={formData.licensePlate}
                onChange={handleInputChange}
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label htmlFor="vehicleMake" className="block text-sm font-medium text-gray-700">
                Vehicle Make
              </label>
              <input
                type="text"
                name="vehicleMake"
                id="vehicleMake"
                value={formData.vehicleMake}
                onChange={handleInputChange}
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label htmlFor="vehicleModel" className="block text-sm font-medium text-gray-700">
                Vehicle Model
              </label>
              <input
                type="text"
                name="vehicleModel"
                id="vehicleModel"
                value={formData.vehicleModel}
                onChange={handleInputChange}
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label htmlFor="vehicleYear" className="block text-sm font-medium text-gray-700">
                Vehicle Year
              </label>
              <input
                type="number"
                name="vehicleYear"
                id="vehicleYear"
                value={formData.vehicleYear}
                onChange={handleInputChange}
                min="1900"
                max="2024"
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>

            {/* Citation Information */}
            <div className="col-span-2">
              <h4 className="text-md font-medium text-gray-900 mb-3 mt-6">Citation Details</h4>
            </div>

            <div>
              <label htmlFor="violationType" className="block text-sm font-medium text-gray-700">
                Violation Type
              </label>
              <select
                name="violationType"
                id="violationType"
                value={formData.violationType}
                onChange={handleInputChange}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              >
                <option value="">Select Violation</option>
                <option value="SPEEDING">Speeding</option>
                <option value="PARKING">Parking Violation</option>
                <option value="RED_LIGHT">Running Red Light</option>
                <option value="STOP_SIGN">Failure to Stop</option>
                <option value="RECKLESS">Reckless Driving</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="fineAmount" className="block text-sm font-medium text-gray-700">
                Fine Amount ($)
              </label>
              <input
                type="number"
                name="fineAmount"
                id="fineAmount"
                value={formData.fineAmount}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="col-span-2">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                name="location"
                id="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Street address or intersection"
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                placeholder="Additional details about the violation..."
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Issue Citation
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}