"use client"

import { useEffect, useState } from "react"
import { Card, Row, Col, Typography, Button, Spin, Alert } from "antd"
import {
  CarOutlined,
  ThunderboltOutlined,
  CrownOutlined,
} from "@ant-design/icons"
import Link from "next/link"

const { Title, Paragraph } = Typography

const services = [
  {
    title: "Basic Wash",
    icon: <CarOutlined className="text-4xl text-blue-600" />,
    desc: "Exterior wash with foam and quick dry",
  },
  {
    title: "Premium Wash",
    icon: <ThunderboltOutlined className="text-4xl text-green-600" />,
    desc: "Interior + exterior deep cleaning",
  },
  {
    title: "Luxury Detailing",
    icon: <CrownOutlined className="text-4xl text-yellow-500" />,
    desc: "Complete detailing & polishing",
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
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* ---------- HERO SECTION ---------- */}
      <div className="text-center mb-20">
        <Title level={1}>
          Premium Car Wash at Your Doorstep 
        </Title>
        <Paragraph className="text-gray-500 text-lg">
          Book professional car wash services in minutes
        </Paragraph>

        <div className="flex justify-center gap-4 mt-6">
          <Link href="/book">
            <Button type="primary" size="large">
              Book Now
            </Button>
          </Link>

          <Link href="/services">
            <Button size="large">View Services</Button>
          </Link>
        </div>
      </div>

      {/* ---------- SERVICES SECTION ---------- */}
      <Title level={2} className="text-center mb-12">
        Our Services
      </Title>

      <Row gutter={[24, 24]}>
        {services.map((service, index) => (
          <Col xs={24} md={12} lg={8} key={index}>
            <Card
              hoverable
              className="h-full text-center shadow-md hover:shadow-xl transition"
            >
              {service.icon}
              <Title level={4} className="mt-4">
                {service.title}
              </Title>
              <Paragraph className="text-gray-500">
                {service.desc}
              </Paragraph>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ---------- CTA SECTION ---------- */}
      <div className="mt-20 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl text-white text-center py-16 px-6">
        <Title level={2} className="!text-white">
          Ready to Shine Your Car? 
        </Title>
        <Paragraph className="text-gray-200 text-lg">
          Schedule a car wash today and experience professional care.
        </Paragraph>

        <Link href="/book">
          <Button
            size="large"
            className="!bg-white !text-blue-600 font-semibold mt-4"
          >
            Book Your Wash
          </Button>
        </Link>
      </div>

      {/* ---------- NEAREST STORES SECTION ---------- */}
      <div className="mt-16">
        <Title level={2} className="text-center mb-6">
          Nearest Washing Centers
        </Title>
        {loadingStores ? (
          <div className="flex justify-center py-6">
            <Spin tip="Loading stores..." />
          </div>
        ) : storeError ? (
          <Alert type="error" message={storeError} showIcon />
        ) : stores.length === 0 ? (
          <Alert type="info" message="No centers added yet." showIcon />
        ) : (
          <Row gutter={[16, 16]}>
            {stores.map((store) => (
              <Col xs={24} md={12} lg={8} key={store._id}>
                <Card className="h-full shadow-sm">
                  <Title level={4}>{store.name}</Title>
                  <Typography.Paragraph className="mb-1">
                    {store.address}
                    {store.city ? `, ${store.city}` : ""}
                    {store.state ? `, ${store.state}` : ""}
                    {store.zip ? `, ${store.zip}` : ""}
                  </Typography.Paragraph>
                  {store.phone && (
                    <Typography.Text className="block text-gray-500">
                      Phone: {store.phone}
                    </Typography.Text>
                  )}
                  <Typography.Text className="text-gray-500 text-sm">
                    Added: {new Date(store.createdAt).toLocaleDateString()}
                  </Typography.Text>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  )
}

export default Home
