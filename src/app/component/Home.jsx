"use client"

import { useEffect, useState } from "react"
import { Card, Row, Col, Typography, Button, Spin, Alert, Tag, Space } from "antd"
import {
  CarOutlined,
  ThunderboltOutlined,
  CrownOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
  FireOutlined,
  DashboardOutlined,
  ToolOutlined,
} from "@ant-design/icons"
import Link from "next/link"

const { Title, Paragraph } = Typography

const services = [
  {
    title: "Bike Foam Wash",
    icon: <FireOutlined className="text-4xl text-orange-500 dark:text-orange-300" />,
    desc: "Streak-free foam wash for bikes & scooters with chain lube option.",
    badge: "Bike / Scooter",
    price: "From ₹199",
  },
  {
    title: "SUV Deep Clean",
    icon: <ThunderboltOutlined className="text-4xl text-emerald-500 dark:text-emerald-300" />,
    desc: "Pressure rinse, foam, interior vacuum, mats & dashboard sanitize.",
    badge: "SUV / MUV",
    price: "From ₹899",
  },
  {
    title: "Ceramic Prep",
    icon: <ToolOutlined className="text-4xl text-sky-500 dark:text-sky-300" />,
    desc: "Pre-coat decontamination, clay, polish for long-lasting shine.",
    badge: "Any Vehicle",
    price: "From ₹1499",
  },
  {
    title: "Interior Spa",
    icon: <DashboardOutlined className="text-4xl text-indigo-500 dark:text-indigo-300" />,
    desc: "Steam + vacuum, upholstery refresh, dash & console detail.",
    badge: "Cars / SUVs",
    price: "From ₹599",
  },
  {
    title: "Luxury Detailing",
    icon: <CrownOutlined className="text-4xl text-amber-500 dark:text-amber-300" />,
    desc: "Multi-stage polish, trim restore, tyre dressing, glass care.",
    badge: "Premium",
    price: "From ₹1299",
  },
  {
    title: "Express Hatchback",
    icon: <CarOutlined className="text-4xl text-blue-500 dark:text-blue-300" />,
    desc: "Quick foam wash + interior wipe-down for busy weekdays.",
    badge: "Hatchback",
    price: "From ₹399",
  },
]

const Home = () => {
  const [stores, setStores] = useState([])
  const [loadingStores, setLoadingStores] = useState(true)
  const [storeError, setStoreError] = useState("")

  useEffect(() => {
    const loadStores = async () => {
      try {
        const res = await fetch("/api/stores")
        const data = await res.json()
        if (!res.ok || !data?.success) {
          throw new Error(data?.error || "Failed to load stores")
        }
        setStores(data.data || [])
      } catch (err) {
        setStoreError(err.message || "Failed to load stores")
      } finally {
        setLoadingStores(false)
      }
    }

    loadStores()
  }, [])

  return (
    <div className="w-full bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* ---------- HERO SECTION ---------- */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 text-white px-8 py-14 shadow-2xl mb-16">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.3),_transparent_35%)]" />
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-2xl">
              <p className="uppercase tracking-[0.25em] text-xs text-blue-200 mb-3">India • Cars • Bikes • EVs</p>
              <Title level={1} className="!text-white leading-tight mb-3">
                Multi-Vehicle Wash & Detail, On-Demand
              </Title>
              <Paragraph className="text-gray-200 text-lg mb-4">
                Foam wash, interior spa, ceramic prep—tailored packages for bikes, hatchbacks, sedans, SUVs, and EVs. Pick a slot, we arrive.
              </Paragraph>
              <Space size="middle" wrap>
                <Link href="/book">
                  <Button type="primary" size="large" className="!bg-blue-500 !border-none hover:!bg-blue-600">Book a Slot</Button>
                </Link>
                <Link href="/services">
                  <Button size="large" className="bg-white/10 text-white border-white/30 hover:bg-white/20">View Packages</Button>
                </Link>
              </Space>
              <div className="flex flex-wrap gap-2 mt-6 text-xs text-blue-100">
                {['Bike Foam', 'SUV Deep Clean', 'Interior Spa', 'Ceramic Prep', 'Doorstep Service'].map((chip) => (
                  <span key={chip} className="px-3 py-1 rounded-full bg-white/10 border border-white/20">{chip}</span>
                ))}
              </div>
            </div>
            <div className="bg-white/5 border border-white/15 rounded-xl p-5 w-full lg:w-[340px]">
              <Title level={4} className="!text-white !mb-3">Popular quick picks</Title>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/10">
                  <div>
                    <p className="text-white font-semibold">Bike Premium Foam</p>
                    <p className="text-blue-100 text-xs">15 min • Chain lube add-on</p>
                  </div>
                  <span className="text-white font-bold">₹349</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/10">
                  <div>
                    <p className="text-white font-semibold">SUV Deep Clean</p>
                    <p className="text-blue-100 text-xs">40 min • Interior vacuum</p>
                  </div>
                  <span className="text-white font-bold">₹899</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/10">
                  <div>
                    <p className="text-white font-semibold">Ceramic Prep</p>
                    <p className="text-blue-100 text-xs">Paint decontam + polish</p>
                  </div>
                  <span className="text-white font-bold">₹1499</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- SERVICES SECTION ---------- */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <Title level={2} className="!mb-0 dark:!text-white">Signature packages</Title>
          <div className="flex gap-2 text-xs text-gray-600 dark:text-gray-300">
            <Tag color="blue">Doorstep</Tag>
            <Tag color="green">Eco foam</Tag>
            <Tag color="gold">Interior care</Tag>
          </div>
        </div>

        <Row gutter={[20, 20]}>
          {services.map((service, index) => (
            <Col xs={24} md={12} lg={8} key={index}>
              <Card
                hoverable
                className="h-full shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100 dark:border-gray-700 dark:bg-gray-800"
                styles={{ body: { padding: 18 } }}
              >
                <div className="flex items-start gap-3">
                  {service.icon}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <Title level={4} className="!mb-1 dark:!text-white">{service.title}</Title>
                      <Tag color="blue" className="font-semibold">{service.price}</Tag>
                    </div>
                    <Paragraph className="text-gray-600 dark:text-gray-300 !mb-2">
                      {service.desc}
                    </Paragraph>
                    <Tag color="geekblue" className="mr-0">{service.badge}</Tag>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* ---------- CTA SECTION ---------- */}
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          <Card className="shadow-lg border border-gray-100 dark:border-gray-700 dark:bg-gray-800" styles={{ body: { padding: 18 } }}>
            <p className="text-sm text-gray-500 dark:text-gray-300 mb-1">Response</p>
            <Title level={3} className="!mb-1 dark:!text-white">30-45 mins</Title>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Avg arrival time in serviceable zones.</p>
          </Card>
          <Card className="shadow-lg border border-gray-100 dark:border-gray-700 dark:bg-gray-800" styles={{ body: { padding: 18 } }}>
            <p className="text-sm text-gray-500 dark:text-gray-300 mb-1">Eco water usage</p>
            <Title level={3} className="!mb-1 dark:!text-white">~35 L</Title>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Foam + pressure rinse with low waste.</p>
          </Card>
          <Card className="shadow-lg border border-gray-100 dark:border-gray-700 dark:bg-gray-800" styles={{ body: { padding: 18 } }}>
            <p className="text-sm text-gray-500 dark:text-gray-300 mb-1">Coverage</p>
            <Title level={3} className="!mb-1 dark:!text-white">Cars, Bikes, EVs</Title>
            <p className="text-gray-600 dark:text-gray-300 text-sm">City-wide slots, 7 days a week.</p>
          </Card>
        </div>

        {/* ---------- NEAREST STORES SECTION ---------- */}
        <div className="mt-16">
          <Title level={2} className="text-center mb-6 dark:!text-white">
              Nearest Washing Centers
            </Title>
            {loadingStores ? (
              <div className="flex justify-center py-6">
                <Spin tip="Loading stores..." fullscreen />
              </div>
            ) : storeError ? (
              <Alert type="error" message={storeError} showIcon />
            ) : stores.length === 0 ? (
              <Alert type="info" message="No centers added yet." showIcon />
            ) : (
              <Row gutter={[20, 20]}>
                {stores.map((store) => (
                  <Col xs={24} md={12} lg={8} key={store._id}>
                    <Card
                      hoverable
                      className="h-full shadow-md dark:bg-gray-800 dark:border-gray-700 border border-gray-100"
                      styles={{ body: { padding: 18 } }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <Title level={4} className="!mb-1 dark:!text-white">
                            {store.name}
                          </Title>
                          <Typography.Text className="text-gray-500 dark:text-gray-400 text-sm">
                            Added {new Date(store.createdAt).toLocaleDateString()}
                          </Typography.Text>
                        </div>
                        <Tag color="blue" icon={<CheckCircleOutlined />}>
                          Open
                        </Tag>
                      </div>

                      <div className="flex items-start gap-2 mb-2 text-gray-700 dark:text-gray-400">
                        <EnvironmentOutlined className="mt-1 text-blue-600 dark:text-blue-400" />
                        <Typography.Paragraph className="!mb-0 text-gray-700 dark:text-gray-400">
                          {store.address}
                          {store.city ? `, ${store.city}` : ""}
                          {store.state ? `, ${store.state}` : ""}
                          {store.zip ? `, ${store.zip}` : ""}
                        </Typography.Paragraph>
                      </div>

                      {store.phone && (
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-400 mb-3">
                          <PhoneOutlined className="text-blue-600 dark:text-blue-400" />
                          <Typography.Text>{store.phone}</Typography.Text>
                        </div>
                      )}

                      <div className="flex gap-3">
                        <Button
                          type="primary"
                          block
                          href={store.latitude && store.longitude
                            ? `https://www.google.com/maps?q=${store.latitude},${store.longitude}`
                            : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${store.address} ${store.city || ''} ${store.state || ''} ${store.zip || ''}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View on Map
                        </Button>
                        <Button
                          block
                          href={store.phone ? `tel:${store.phone}` : undefined}
                          disabled={!store.phone}
                        >
                          Call
                        </Button>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </div>
        </div>
      </div>
    )
  }
  
  export default Home
