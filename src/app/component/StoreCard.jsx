'use client'

import React from 'react'
import { Card, Button, Rate, Tag, Badge, Space, Tooltip } from 'antd'
import {
  EnvironmentOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons'

const StoreCard = ({ store, onBook, onViewDetails, onGetDirections }) => {
  const isOpen = store.isOpen !== false // Assume open if not specified
  const hasAvailableBays = store.availableBays > 0

  return (
    <Card
      className="!bg-white dark:!bg-gray-800 !border-2 !border-gray-200 dark:!border-gray-700 !shadow-xl hover:!shadow-2xl hover:!scale-[1.02] transition-all duration-300 !rounded-2xl overflow-hidden mb-6"
      bodyStyle={{ padding: 0 }}
    >
      {/* Header Section with Gradient */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 dark:from-blue-700 dark:via-purple-700 dark:to-blue-800 px-6 py-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h3 className="text-2xl font-bold text-white">{store.name}</h3>
              {isOpen ? (
                <Badge status="success" text="Open Now" className="!bg-green-100 dark:!bg-green-900 !px-3 !py-1 !rounded-full !text-green-700 dark:!text-green-300 !font-bold !text-xs" />
              ) : (
                <Badge status="error" text="Closed" className="!bg-red-100 dark:!bg-red-900 !px-3 !py-1 !rounded-full !text-red-700 dark:!text-red-300 !font-bold !text-xs" />
              )}
            </div>

            {/* Rating and reviews */}
            <div className="flex items-center gap-2 bg-white/20 dark:bg-black/20 px-3 py-2 rounded-lg w-fit">
              <Rate
                allowHalf
                disabled
                value={store.rating}
                className="!text-yellow-300"
                style={{ fontSize: '14px' }}
              />
              <span className="text-sm font-bold text-white">
                {store.rating.toFixed(1)} <span className="text-white/80">({store.reviewCount})</span>
              </span>
            </div>
          </div>

          {/* Distance badge */}
          <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-xl text-center shadow-lg">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {store.distance}<span className="text-base">km</span>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 font-semibold mt-1">
              ⏱️ {store.estimatedTime} min
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">

        {/* Address and contact in colored cards */}
        <div className="grid grid-cols-1 gap-3">
          <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-4 rounded-xl border-2 border-red-200 dark:border-red-800">
            <div className="flex items-start gap-3">
              <div className="bg-red-500 text-white p-2 rounded-lg">
                <EnvironmentOutlined className="text-lg" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-red-600 dark:text-red-400 mb-1">ADDRESS</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{store.address}</p>
                {store.city && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {store.city}, {store.state} {store.zip}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-xl border-2 border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 text-white p-2 rounded-lg">
                <PhoneOutlined className="text-lg" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">CONTACT</p>
                <a
                  href={`tel:${store.phone}`}
                  className="text-base font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {store.phone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Availability status */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-900/30 dark:via-green-900/30 dark:to-teal-900/30 p-4 rounded-xl border-2 border-emerald-300 dark:border-emerald-700 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-emerald-500 text-white p-1.5 rounded-lg">
                <span className="text-sm">🚗</span>
              </div>
              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">AVAILABLE BAYS</p>
            </div>
            <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">
              {store.availableBays}<span className="text-lg text-gray-500 dark:text-gray-400">/{store.capacity}</span>
            </p>
          </div>

          <div className={`p-4 rounded-xl border-2 shadow-md ${hasAvailableBays ? 'bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 dark:from-blue-900/30 dark:via-cyan-900/30 dark:to-sky-900/30 border-blue-300 dark:border-blue-700' : 'bg-gradient-to-br from-red-50 via-orange-50 to-red-50 dark:from-red-900/30 dark:via-orange-900/30 dark:to-red-900/30 border-red-300 dark:border-red-700'}`}>
            <div className="flex items-center gap-2 mb-2">
              <div className={`text-white p-1.5 rounded-lg ${hasAvailableBays ? 'bg-blue-500' : 'bg-red-500'}`}>
                <span className="text-sm">⏱️</span>
              </div>
              <p className={`text-xs font-bold ${hasAvailableBays ? 'text-blue-700 dark:text-blue-400' : 'text-red-700 dark:text-red-400'}`}>
                WAIT TIME
              </p>
            </div>
            <p className={`text-3xl font-bold ${hasAvailableBays ? 'text-blue-700 dark:text-blue-300' : 'text-red-700 dark:text-red-300'}`}>
              {store.estimatedWaitTime || '~5'}<span className="text-lg"> min</span>
            </p>
          </div>
        </div>

        {/* Services offered */}
        {store.services && store.services.length > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-xl border-2 border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-purple-500 text-white p-1.5 rounded-lg">
                <span className="text-sm">✨</span>
              </div>
              <p className="text-xs font-bold text-purple-700 dark:text-purple-400">SERVICES AVAILABLE</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {store.services.slice(0, 3).map((service, idx) => (
                <Tag
                  key={idx}
                  className="!bg-white dark:!bg-gray-700 !text-purple-700 dark:!text-purple-300 !border-purple-300 dark:!border-purple-600 !px-3 !py-1 !rounded-lg !font-semibold"
                >
                  {service.name} <span className="font-bold text-green-600 dark:text-green-400">₹{service.price}</span>
                </Tag>
              ))}
              {store.services.length > 3 && (
                <Tag className="!bg-gray-200 dark:!bg-gray-700 !text-gray-700 dark:!text-gray-300 !px-3 !py-1 !rounded-lg !font-bold">
                  +{store.services.length - 3} more
                </Tag>
              )}
            </div>
          </div>
        )}

        {/* Facilities */}
        {store.facilities && (
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 p-4 rounded-xl border-2 border-cyan-200 dark:border-cyan-800">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-cyan-500 text-white p-1.5 rounded-lg">
                <span className="text-sm">🏢</span>
              </div>
              <p className="text-xs font-bold text-cyan-700 dark:text-cyan-400">FACILITIES</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {store.facilities.hasParking && (
                <Tooltip title="Parking Available">
                  <Tag icon={<CheckCircleOutlined />} className="!bg-blue-100 dark:!bg-blue-900/40 !text-blue-700 dark:!text-blue-300 !border-blue-300 dark:!border-blue-700 !px-3 !py-1 !rounded-lg !font-semibold">
                    🅿️ Parking
                  </Tag>
                </Tooltip>
              )}
              {store.facilities.hasWaitingArea && (
                <Tooltip title="Waiting Area">
                  <Tag icon={<CheckCircleOutlined />} className="!bg-green-100 dark:!bg-green-900/40 !text-green-700 dark:!text-green-300 !border-green-300 dark:!border-green-700 !px-3 !py-1 !rounded-lg !font-semibold">
                    🪑 Waiting Area
                  </Tag>
                </Tooltip>
              )}
              {store.facilities.hasWifi && (
                <Tooltip title="WiFi Available">
                  <Tag icon={<CheckCircleOutlined />} className="!bg-cyan-100 dark:!bg-cyan-900/40 !text-cyan-700 dark:!text-cyan-300 !border-cyan-300 dark:!border-cyan-700 !px-3 !py-1 !rounded-lg !font-semibold">
                    📶 WiFi
                  </Tag>
                </Tooltip>
              )}
              {store.facilities.hasRefreshments && (
                <Tooltip title="Refreshments">
                  <Tag icon={<CheckCircleOutlined />} className="!bg-orange-100 dark:!bg-orange-900/40 !text-orange-700 dark:!text-orange-300 !border-orange-300 dark:!border-orange-700 !px-3 !py-1 !rounded-lg !font-semibold">
                    ☕ Refreshments
                  </Tag>
                </Tooltip>
              )}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="primary"
            size="large"
            icon={<ShoppingCartOutlined />}
            onClick={() => onBook(store)}
            disabled={!hasAvailableBays}
            className="flex-1 !h-12 !font-bold !rounded-xl !shadow-lg hover:!shadow-xl !transition-all !bg-gradient-to-r !from-green-500 !to-emerald-600 hover:!from-green-600 hover:!to-emerald-700 !border-0 disabled:!from-gray-400 disabled:!to-gray-500"
          >
            {hasAvailableBays ? '🎯 Book Now' : '🚫 Fully Booked'}
          </Button>

          <Button
            size="large"
            onClick={() => onViewDetails(store)}
            className="!h-12 !px-6 !font-bold !rounded-xl !bg-white dark:!bg-gray-700 !text-blue-600 dark:!text-blue-400 !border-2 !border-blue-500 dark:!border-blue-600 hover:!bg-blue-50 dark:hover:!bg-gray-600 !shadow-lg hover:!shadow-xl !transition-all"
          >
            📋 Details
          </Button>

          <Button
            size="large"
            onClick={() => onGetDirections(store)}
            icon={<EnvironmentOutlined />}
            className="!h-12 !px-6 !font-bold !rounded-xl    !bg-white dark:!bg-gray-700 !text-red-600 dark:!text-red-400 !border-2 !border-red-500 dark:!border-red-600 hover:!bg-red-50 dark:hover:!bg-gray-600 !shadow-lg hover:!shadow-xl !transition-all"
            title="Get Directions"
          >
            🗺️
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default StoreCard
