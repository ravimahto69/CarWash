'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, Spin, message, Button, Slider, Rate, Checkbox, Space, Tabs, Modal, Tag } from 'antd'
import {
  EnvironmentOutlined,
  FilterOutlined,
  EnvironmentFilled,
  UnorderedListOutlined,
  DeleteOutlined
} from '@ant-design/icons'
import StoreCard from './StoreCard'

const NearbyStores = () => {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(false)
  const [userLocation, setUserLocation] = useState(null)
  const [filteredStores, setFilteredStores] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [selectedStore, setSelectedStore] = useState(null)

  // Filters
  const [filters, setFilters] = useState({
    distance: 5,
    minRating: 0,
    openNow: false,
    hasAvailableBays: false,
    priceRange: [0, 1000],
    services: []
  })

  // Define applyFiltersWithStores first
  const applyFiltersWithStores = useCallback((storeList) => {
    let filtered = [...storeList]

    // Filter by distance
    filtered = filtered.filter(s => s.distance <= filters.distance)

    // Filter by rating
    filtered = filtered.filter(s => s.rating >= filters.minRating)

    // Filter by available bays
    if (filters.hasAvailableBays) {
      filtered = filtered.filter(s => s.availableBays > 0)
    }

    // Filter by services
    if (filters.services.length > 0) {
      filtered = filtered.filter(store =>
        filters.services.some(service =>
          store.services?.some(s => s.name.toLowerCase().includes(service.toLowerCase()))
        )
      )
    }

    setFilteredStores(filtered)
  }, [filters])

  const fetchNearbyStores = useCallback(async (latitude, longitude) => {
    try {
      const maxDistance = filters.distance * 1000 // Convert km to meters
      const res = await fetch(
        `/api/stores/nearby?latitude=${latitude}&longitude=${longitude}&maxDistance=${maxDistance}&minRating=${filters.minRating}&limit=50`
      )
      const data = await res.json()

      if (data.success) {
        setStores(data.data)
        applyFiltersWithStores(data.data)
        message.success(`Found ${data.count} nearby car wash centers!`)
      } else {
        message.error(data.error || 'Failed to fetch stores')
      }
    } catch (err) {
      console.error('Fetch error:', err)
      message.error('Failed to fetch nearby stores')
    } finally {
      setLoading(false)
    }
  }, [filters.distance, filters.minRating, applyFiltersWithStores])

  // Get user location and fetch nearby stores
  const requestUserLocation = useCallback(() => {
    setLoading(true)
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ latitude, longitude })
          fetchNearbyStores(latitude, longitude)
        },
        (error) => {
          console.error('Location error:', error)
          message.error('Unable to get your location. Please enable location services.')
          setLoading(false)
          // Use default location (New York for demo)
          const defaultLat = 40.7128
          const defaultLng = -74.006
          setUserLocation({ latitude: defaultLat, longitude: defaultLng })
          fetchNearbyStores(defaultLat, defaultLng)
        }
      )
    } else {
      message.error('Geolocation is not supported by your browser.')
      setLoading(false)
    }
  }, [fetchNearbyStores])

  useEffect(() => {
    requestUserLocation()
  }, [requestUserLocation])

  // Apply filters whenever they change
  useEffect(() => {
    if (stores.length > 0) {
      applyFiltersWithStores(stores)
    }
  }, [filters, stores, applyFiltersWithStores])

  const handleResetLocation = () => {
    setFilters({
      distance: 5,
      minRating: 0,
      openNow: false,
      hasAvailableBays: false,
      priceRange: [0, 1000],
      services: []
    })
    requestUserLocation()
  }

  const handleBook = (store) => {
    message.info(`Redirecting to book ${store.name}...`)
    // TODO: Navigate to booking page with store ID
  }

  const handleViewDetails = (store) => {
    setSelectedStore(store)
  }

  const handleGetDirections = (store) => {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${store.latitude},${store.longitude}`
    window.open(mapsUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex-1">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
                  🗺️ Find Nearby Washing Centers
                </h1>
                {userLocation && (
                  <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    📍 <span className="font-medium">Your location:</span> ({userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)})
                  </p>
                )}
              </div>
              <Button
                type="primary"
                icon={<EnvironmentFilled />}
                size="large"
                onClick={handleResetLocation}
                className="!h-12 !px-6 !font-bold !rounded-xl !bg-gradient-to-r !from-green-500 !to-emerald-600 !border-none !shadow-lg hover:!shadow-xl"
              >
                Update Location
              </Button>
            </div>
          </div>

          {/* Filter Button and Result Count */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <Button
              icon={<FilterOutlined />}
              onClick={() => setShowFilters(!showFilters)}
              size="large"
              className="!font-bold !h-12 !px-6 !rounded-xl !bg-white dark:!bg-gray-800 !shadow-lg hover:!shadow-xl !border-2 !border-blue-200 dark:!border-blue-700"
            >
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
            {!loading && filteredStores.length > 0 && (
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white px-6 py-3 rounded-xl shadow-lg font-bold text-lg">
                ✓ Found {filteredStores.length} car wash center{filteredStores.length > 1 ? 's' : ''} near you
              </div>
            )}
          </div>
        </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card
          className="!bg-white dark:!bg-gray-800 !border !border-gray-200 dark:!border-gray-700 !shadow-2xl !rounded-2xl mb-8 overflow-hidden"
          bodyStyle={{ padding: 0 }}
        >
          {/* Filter Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 px-6 py-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <FilterOutlined className="text-2xl" />
              Search Filters
            </h3>
            <p className="text-blue-100 text-sm mt-1">Refine your search results</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Distance Filter */}
            <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl border-2 border-blue-200 dark:border-blue-700">
              <div className="flex items-center justify-between mb-4">
                <p className="font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2 text-base">
                  📏 Distance Range
                </p>
                <span className="text-xl font-bold text-blue-700 dark:text-blue-300 px-3 py-1 bg-blue-100 dark:bg-blue-900/50 rounded-lg border border-blue-300 dark:border-blue-600">
                  {filters.distance} km
                </span>
              </div>
              <div className="px-2 pb-4">
                <Slider
                  min={1}
                  max={20}
                  value={filters.distance}
                  onChange={(val) => setFilters({ ...filters, distance: val })}
                  marks={{
                    1: { style: { color: 'inherit', fontSize: '12px' }, label: <span className="text-gray-600 dark:text-gray-400">1km</span> },
                    5: { style: { color: 'inherit', fontSize: '12px' }, label: <span className="text-gray-600 dark:text-gray-400">5km</span> },
                    10: { style: { color: 'inherit', fontSize: '12px' }, label: <span className="text-gray-600 dark:text-gray-400">10km</span> },
                    15: { style: { color: 'inherit', fontSize: '12px' }, label: <span className="text-gray-600 dark:text-gray-400">15km</span> },
                    20: { style: { color: 'inherit', fontSize: '12px' }, label: <span className="text-gray-600 dark:text-gray-400">20km</span> }
                  }}
                />
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-200 mt-2 bg-white/50 dark:bg-gray-900/50 px-3 py-2 rounded-lg">
                Search within {filters.distance} kilometer{filters.distance > 1 ? 's' : ''} from your location
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rating Filter */}
              <div className="p-5 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-800/30 rounded-xl border-2 border-yellow-200 dark:border-yellow-700">
                <p className="font-bold text-yellow-900 dark:text-yellow-100 mb-4 flex items-center gap-2 text-base">
                  ⭐ Minimum Rating
                </p>
                <div className="flex items-center gap-4 mb-4 bg-white/50 dark:bg-gray-900/50 px-4 py-3 rounded-lg">
                  <Rate
                    allowHalf
                    value={filters.minRating}
                    onChange={(val) => setFilters({ ...filters, minRating: val })}
                    className="!text-yellow-500"
                  />
                  <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-300">
                    {filters.minRating > 0 ? `${filters.minRating}+` : 'Any'}
                  </span>
                </div>
                <p className="text-sm text-yellow-700 dark:text-yellow-200 bg-white/50 dark:bg-gray-900/50 px-3 py-2 rounded-lg">
                  {filters.minRating > 0 
                    ? `Show stores rated ${filters.minRating} stars and above` 
                    : 'Show all rated stores'}
                </p>
              </div>

              {/* Price Filter */}
              <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-800/30 rounded-xl border-2 border-green-200 dark:border-green-700">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-bold text-green-900 dark:text-green-100 flex items-center gap-2 text-base">
                    💰 Price Range
                  </p>
                  <span className="text-lg font-bold text-green-700 dark:text-green-300 px-3 py-1 bg-green-100 dark:bg-green-900/50 rounded-lg whitespace-nowrap border border-green-300 dark:border-green-600">
                    ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
                  </span>
                </div>
                <div className="px-2 pb-4">
                  <Slider
                    range
                    min={0}
                    max={1000}
                    value={filters.priceRange}
                    onChange={(val) => setFilters({ ...filters, priceRange: val })}
                    marks={{ 
                      0: { style: { color: 'inherit', fontSize: '11px' }, label: <span className="text-gray-600 dark:text-gray-400">₹0</span> },
                      250: { style: { color: 'inherit', fontSize: '11px' }, label: <span className="text-gray-600 dark:text-gray-400">₹250</span> },
                      500: { style: { color: 'inherit', fontSize: '11px' }, label: <span className="text-gray-600 dark:text-gray-400">₹500</span> },
                      750: { style: { color: 'inherit', fontSize: '11px' }, label: <span className="text-gray-600 dark:text-gray-400">₹750</span> },
                      1000: { style: { color: 'inherit', fontSize: '11px' }, label: <span className="text-gray-600 dark:text-gray-400">₹1000</span> }
                    }}
                  />
                </div>
                <p className="text-sm text-green-700 dark:text-green-200 mt-2 bg-white/50 dark:bg-gray-900/50 px-3 py-2 rounded-lg">
                  Filter services by price range
                </p>
              </div>
            </div>

            {/* Availability Filter */}
            <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-800/30 rounded-xl border-2 border-purple-200 dark:border-purple-700">
              <p className="font-bold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2 text-base">
                ✅ Additional Filters
              </p>
              <div className="space-y-3 bg-white/50 dark:bg-gray-900/50 px-4 py-3 rounded-lg">
                <label className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    checked={filters.hasAvailableBays}
                    onChange={(e) => setFilters({ ...filters, hasAvailableBays: e.target.checked })}
                  />
                  <span className="font-medium text-gray-900 dark:text-white">Only show stores with available bays</span>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex gap-3">
            <Button
              type="primary"
              size="large"
              onClick={() => setShowFilters(false)}
              className="!font-bold !rounded-lg !bg-gradient-to-r !from-blue-600 !to-purple-600 !border-none !shadow-lg flex-1"
            >
              Apply Filters ({filteredStores.length} results)
            </Button>
            <Button
              icon={<DeleteOutlined />}
              size="large"
              onClick={() => {
                setFilters({
                  distance: 5,
                  minRating: 0,
                  openNow: false,
                  hasAvailableBays: false,
                  priceRange: [0, 1000],
                  services: []
                })
              }}
              className="!font-bold !rounded-lg"
            >
              Reset
            </Button>
          </div>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-20">
          <Spin size="large" tip="Finding nearby car wash centers..." />
        </div>
      )}

      {/* Results */}
      {!loading && (
        <div className="space-y-4">
          {filteredStores.length === 0 ? (
            <Card className="!text-center !py-20 !bg-gradient-to-br !from-gray-50 !to-gray-100 dark:!from-gray-800 dark:!to-gray-700">
              <EnvironmentOutlined className="!text-5xl !text-gray-300 dark:!text-gray-500 mb-4 block" />
              <p className="!text-xl !text-gray-600 dark:!text-gray-400 !font-semibold">
                No car wash centers found in this area
              </p>
              <p className="!text-gray-500 dark:!text-gray-500 mt-2">
                Try adjusting your filters or searching in a different area
              </p>
              <Button
                type="primary"
                onClick={handleResetLocation}
                className="!mt-6 !font-bold !rounded-lg !bg-gradient-to-r !from-blue-600 !to-blue-700"
              >
                Update Location
              </Button>
            </Card>
          ) : (
            <div>
              <div className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 p-4 rounded-lg border-2 border-blue-300 dark:border-blue-600 mb-6 shadow-md">
                <p className="text-base font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                  ✅ Found <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">{filteredStores.length}</span> <span>car wash centers near you</span>
                </p>
              </div>

              {filteredStores.map((store, idx) => (
                <StoreCard
                  key={store._id || idx}
                  store={store}
                  onBook={handleBook}
                  onViewDetails={handleViewDetails}
                  onGetDirections={handleGetDirections}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Store Details Modal */}
      <Modal
        title={selectedStore && <span className="text-2xl font-bold text-gray-900 dark:text-white">{selectedStore.name}</span>}
        open={!!selectedStore}
        onCancel={() => setSelectedStore(null)}
        footer={[
          <Button key="directions" onClick={() => handleGetDirections(selectedStore)} size="large" className="!font-bold !rounded-lg !h-10">
            🗺️ Get Directions
          </Button>,
          <Button key="close" onClick={() => setSelectedStore(null)} size="large" className="!font-bold !rounded-lg !h-10">
            ✕ Close
          </Button>,
          <Button
            key="book"
            type="primary"
            size="large"
            onClick={() => {
              handleBook(selectedStore)
              setSelectedStore(null)
            }}
            className="!font-bold !rounded-lg !h-10 !bg-gradient-to-r !from-green-600 !to-emerald-600 !border-none"
          >
            🎯 Book Now
          </Button>
        ]}
        width={700}
        bodyStyle={{ backgroundColor: '#ffffff', padding: '24px' }}
        className="dark:[&_.ant-modal-content]:bg-gray-800"
      >
        {selectedStore && (
          <div className="space-y-5">
            {/* Rating and Distance Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-800/30 rounded-xl border-2 border-yellow-200 dark:border-yellow-700">
                <p className="text-xs font-bold text-yellow-700 dark:text-yellow-300 mb-2 uppercase tracking-wide">⭐ Rating</p>
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{selectedStore.rating}</p>
                <p className="text-sm text-yellow-600 dark:text-yellow-300 font-semibold mt-1">({selectedStore.reviewCount} reviews)</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-800/30 rounded-xl border-2 border-blue-200 dark:border-blue-700">
                <p className="text-xs font-bold text-blue-700 dark:text-blue-300 mb-2 uppercase tracking-wide">📍 Distance</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{selectedStore.distance}<span className="text-lg">km</span></p>
                <p className="text-sm text-blue-600 dark:text-blue-300 font-semibold mt-1">~{selectedStore.estimatedTime} min away</p>
              </div>
            </div>

            {/* Location */}
            <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/30 dark:to-pink-800/30 rounded-xl border-2 border-red-200 dark:border-red-700">
              <p className="font-bold text-red-700 dark:text-red-300 mb-3 flex items-center gap-2 text-base">📍 Location Details</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedStore.address}</p>
              {selectedStore.phone && (
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-3 flex items-center gap-2">📞 {selectedStore.phone}</p>
              )}
            </div>

            {/* Services */}
            {selectedStore.services && selectedStore.services.length > 0 && (
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-800/30 rounded-xl border-2 border-purple-200 dark:border-purple-700">
                <p className="font-bold text-purple-700 dark:text-purple-300 mb-3 flex items-center gap-2 text-base">✨ Services</p>
                <div className="space-y-2">
                  {selectedStore.services.map((service, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{service.name}</span>
                      <span className="text-sm font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/40 px-3 py-1 rounded-lg">₹{service.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Facilities */}
            {selectedStore.facilities && (
              <div className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/30 dark:to-blue-800/30 rounded-xl border-2 border-cyan-200 dark:border-cyan-700">
                <p className="font-bold text-cyan-700 dark:text-cyan-300 mb-3 flex items-center gap-2 text-base">🏢 Facilities</p>
                <div className="flex flex-wrap gap-2">
                  {selectedStore.facilities.hasParking && <Tag className="!bg-blue-100 dark:!bg-blue-900/40 !text-blue-700 dark:!text-blue-300 !border-blue-300 dark:!border-blue-700 !px-3 !py-1 !rounded-lg !font-semibold">🅿️ Parking</Tag>}
                  {selectedStore.facilities.hasWaitingArea && <Tag className="!bg-green-100 dark:!bg-green-900/40 !text-green-700 dark:!text-green-300 !border-green-300 dark:!border-green-700 !px-3 !py-1 !rounded-lg !font-semibold">🪑 Waiting Area</Tag>}
                  {selectedStore.facilities.hasWifi && <Tag className="!bg-cyan-100 dark:!bg-cyan-900/40 !text-cyan-700 dark:!text-cyan-300 !border-cyan-300 dark:!border-cyan-700 !px-3 !py-1 !rounded-lg !font-semibold">📶 WiFi</Tag>}
                  {selectedStore.facilities.hasRefreshments && <Tag className="!bg-orange-100 dark:!bg-orange-900/40 !text-orange-700 dark:!text-orange-300 !border-orange-300 dark:!border-orange-700 !px-3 !py-1 !rounded-lg !font-semibold">☕ Refreshments</Tag>}
                </div>
              </div>
            )}

            {/* Current Status */}
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-800/30 rounded-xl border-2 border-emerald-200 dark:border-emerald-700">
              <p className="font-bold text-emerald-700 dark:text-emerald-300 mb-3 flex items-center gap-2 text-base">📊 Current Status</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-blue-200 dark:border-blue-600">
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Available Bays</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300 mt-1">
                    {selectedStore.availableBays}/<span className="text-base text-gray-500 dark:text-gray-400">{selectedStore.capacity}</span>
                  </p>
                </div>
                <div className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-green-200 dark:border-green-600">
                  <p className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wide">Wait Time</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300 mt-1">
                    ~{selectedStore.estimatedWaitTime || 5}<span className="text-base text-gray-500 dark:text-gray-400"> min</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
      </div>
    </div>
  )
}

export default NearbyStores
