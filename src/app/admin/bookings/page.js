'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, DatePicker, Flex, Select, Space, Table, Tag, message } from 'antd'
import dayjs from 'dayjs'

const STATUS_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Paid', value: 'paid' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
]

const STATUS_COLORS = {
  pending: 'gold',
  paid: 'blue',
  completed: 'green',
  cancelled: 'red',
}

export default function AdminBookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState([])
  const [status, setStatus] = useState('')
  const [dateRange, setDateRange] = useState(null)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 10

  const queryString = useMemo(() => {
    const params = new URLSearchParams()
    if (status) params.append('status', status)
    if (dateRange?.[0]) params.append('from', dateRange[0].format('YYYY-MM-DD'))
    if (dateRange?.[1]) params.append('to', dateRange[1].format('YYYY-MM-DD'))
    params.append('page', String(page))
    params.append('limit', String(pageSize))
    return params.toString()
  }, [status, dateRange, page])

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/admin/bookings?${queryString}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to load bookings')
        setBookings(data.data)
        setTotal(data.total)
      } catch (error) {
        message.error(error.message || 'Unable to load bookings')
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [queryString])

  const handleStatusUpdate = async (bookingId, nextStatus) => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, status: nextStatus }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Update failed')
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, bookingStatus: nextStatus } : b))
      )
      message.success('Status updated')
    } catch (error) {
      message.error(error.message || 'Unable to update status')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      title: 'Customer',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <span>{text}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{record.phone}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{record.email}</span>
        </Space>
      ),
    },
    {
      title: 'Vehicle',
      key: 'vehicle',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <span>{record.brand} {record.model}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{record.vehicleType}</span>
        </Space>
      ),
    },
    {
      title: 'Service',
      dataIndex: 'service',
      key: 'service',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (value) => `₹${value || 0}`,
    },
    {
      title: 'Status',
      dataIndex: 'bookingStatus',
      key: 'status',
      render: (value) => <Tag color={STATUS_COLORS[value] || 'default'}>{value}</Tag>,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value) => dayjs(value).format('DD MMM YYYY, HH:mm'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            onClick={() => handleStatusUpdate(record._id, 'completed')}
            disabled={record.bookingStatus === 'completed'}
          >
            Mark Completed
          </Button>
          <Button
            size="small"
            danger
            onClick={() => handleStatusUpdate(record._id, 'cancelled')}
            disabled={record.bookingStatus === 'cancelled'}
          >
            Cancel
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className="px-6 py-6 bg-white dark:bg-gray-900 min-h-screen transition-colors">
      <Flex justify="space-between" align="center" className="mb-4">
        <div>
          <h1 className="text-xl font-semibold dark:text-white">Bookings Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Monitor incoming bookings, payments, and fulfillment status.
          </p>
        </div>
        <Space>
          <Button type="primary" onClick={() => router.push('/admin')}>
            Go to Admin Dashboard
          </Button>
          <Select
            style={{ width: 150 }}
            options={STATUS_OPTIONS}
            value={status}
            onChange={(value) => {
              setStatus(value)
              setPage(1)
            }}
          />
          <DatePicker.RangePicker
            value={dateRange}
            onChange={(value) => {
              setDateRange(value)
              setPage(1)
            }}
          />
          <Button onClick={() => setDateRange(null)}>Clear Dates</Button>
        </Space>
      </Flex>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={bookings}
        loading={loading}
        pagination={{
          current: page,
          pageSize,
          total,
          onChange: (nextPage) => setPage(nextPage),
        }}
      />
    </div>
  )
}
