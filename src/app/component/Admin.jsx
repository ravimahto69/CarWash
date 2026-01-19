"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Card,
  Form,
  Input,
  InputNumber,
  Button,
  Switch,
  Row,
  Col,
  List,
  Table,
  Tag,
  message,
  Statistic,
} from "antd"
import {
  ShoppingOutlined,
  ShopOutlined,
  CalendarOutlined,
  LogoutOutlined,
  PlusOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons"

const AdminDashboard = () => {
  const router = useRouter()

  const [serviceForm] = Form.useForm()
  const [storeForm] = Form.useForm()

  const [activeSection, setActiveSection] = useState("services")

  const [services, setServices] = useState([])
  const [stores, setStores] = useState([])
  const [bookings, setBookings] = useState([])
  const [loadingBookings, setLoadingBookings] = useState(false)

  const vehicleTypeOptions = [
    { label: "Bike / Scooter", value: "bike" },
    { label: "Hatchback", value: "hatchback" },
    { label: "Sedan", value: "sedan" },
    { label: "SUV", value: "suv" },
    { label: "Luxury", value: "luxury" },
    { label: "Pickup / Van", value: "pickup" },
    { label: "Truck", value: "truck" },
    { label: "Electric (EV)", value: "ev" },
  ]

  /* ---------------- AUTH CHECK ---------------- */
  useEffect(() => {
    const authUser = localStorage.getItem("auth_user")
    if (!authUser) router.push("/login")
  }, [router])

  /* ---------------- LOAD DATA ---------------- */
  const loadData = async () => {
    try {
      const [svcRes, storeRes] = await Promise.all([
        fetch("/api/services"),
        fetch("/api/stores"),
      ])

      const svcJson = await svcRes.json()
      const storeJson = await storeRes.json()

      if (svcJson?.success) setServices(svcJson.data || [])
      if (storeJson?.success) setStores(storeJson.data || [])
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  /* ---------------- BOOKINGS ---------------- */
  useEffect(() => {
    const fetchBookings = async () => {
      setLoadingBookings(true)
      try {
        const res = await fetch("/api/admin/bookings")
        const data = await res.json()
        if (res.ok) setBookings(data.data || [])
      } catch {
        message.error("Failed to load bookings")
      } finally {
        setLoadingBookings(false)
      }
    }
    fetchBookings()
  }, [])

  /* ---------------- ADD SERVICE ---------------- */
  const onAddService = async (values) => {
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      const data = await res.json()

      if (!res.ok) return message.error(data.error)
      message.success("Service added")
      serviceForm.resetFields()
      loadData()
    } catch {
      message.error("Service creation failed")
    }
  }

  /* ---------------- ADD STORE ---------------- */
  const onAddStore = async (values) => {
    try {
      const res = await fetch("/api/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      const data = await res.json()

      if (!res.ok) return message.error(data.error)
      message.success("Store added")
      storeForm.resetFields()
      loadData()
    } catch {
      message.error("Store creation failed")
    }
  }

  /* ---------------- BOOKING TABLE ---------------- */
  const bookingColumns = [
    { title: "Customer", dataIndex: "name" },
    { title: "Service", dataIndex: "service" },
    { title: "Amount", dataIndex: "amount", render: v => `₹${v}` },
    {
      title: "Status",
      dataIndex: "bookingStatus",
      render: s => (
        <Tag color={s === "completed" ? "green" : s === "paid" ? "blue" : "gold"}>
          {s}
        </Tag>
      ),
    },
  ]

  /* ---------------- LOGOUT ---------------- */
  const logout = () => {
    localStorage.removeItem("auth_user")
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Row className="h-screen">
        {/* ---------------- SIDEBAR ---------------- */}
        <Col xs={24} md={5} className="bg-gradient-to-b from-red-500 to-red-600 dark:from-red-900 dark:to-red-950 shadow-2xl min-h-screen p-6 border-r dark:border-gray-700 overflow-y-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">
              Admin Panel
            </h2>
            <div className="h-1 w-12 bg-white mx-auto rounded"></div>
          </div>

          <div className="space-y-3 mb-10">
            <Button
              block
              type={activeSection === "services" ? "primary" : "text"}
              onClick={() => setActiveSection("services")}
              className="h-12 text-white font-semibold text-base hover:bg-red-400 dark:hover:bg-red-700 transition-all duration-200"
              style={activeSection === "services" ? {backgroundColor: "rgba(255,255,255,0.2)"} : {}}
              icon={<ShoppingOutlined />}
            >
              Services
            </Button>

            <Button
              block
              type={activeSection === "stores" ? "primary" : "text"}
              onClick={() => setActiveSection("stores")}
              className="h-12 text-white font-semibold text-base hover:bg-red-400 dark:hover:bg-red-700 transition-all duration-200"
              style={activeSection === "stores" ? {backgroundColor: "rgba(255,255,255,0.2)"} : {}}
              icon={<ShopOutlined />}
            >
              Stores
            </Button>

            <Button
              block
              type={activeSection === "bookings" ? "primary" : "text"}
              onClick={() => setActiveSection("bookings")}
              className="h-12 text-white font-semibold text-base hover:bg-red-400 dark:hover:bg-red-700 transition-all duration-200"
              style={activeSection === "bookings" ? {backgroundColor: "rgba(255,255,255,0.2)"} : {}}
              icon={<CalendarOutlined />}
            >
              Bookings
            </Button>
          </div>

          <Button 
            block 
            type="default"
            onClick={() => router.push("/admin/bookings")}
            className="h-11 font-semibold mb-8 bg-white text-red-600 hover:bg-gray-100 transition-all duration-200"
            icon={<CheckCircleOutlined />}
          >
            Manage Bookings
          </Button>

          <Button 
            danger 
            block 
            onClick={logout}
            className="h-11 font-semibold"
            icon={<LogoutOutlined />}
          >
            Logout
          </Button>
        </Col>

        {/* ---------------- CONTENT ---------------- */}
        <Col xs={24} md={19} className="p-8 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
          {/* ---- STATS ---- */}
          <Row gutter={[24, 24]} className="mb-10">
            <Col xs={24} sm={8}>
              <Card 
                className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800"
                bordered={false}
              >
                <Statistic
                  title={<span className="dark:text-blue-200">Total Services</span>}
                  value={services.length}
                  prefix={<ShoppingOutlined className="text-blue-600 dark:text-blue-400" />}
                  valueStyle={{ color: "#2563eb", fontSize: "2rem", fontWeight: "bold" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card 
                className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800"
                bordered={false}
              >
                <Statistic
                  title={<span className="dark:text-green-200">Total Stores</span>}
                  value={stores.length}
                  prefix={<ShopOutlined className="text-green-600 dark:text-green-400" />}
                  valueStyle={{ color: "#16a34a", fontSize: "2rem", fontWeight: "bold" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card 
                className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800"
                bordered={false}
              >
                <Statistic
                  title={<span className="dark:text-purple-200">Total Bookings</span>}
                  value={bookings.length}
                  prefix={<CalendarOutlined className="text-purple-600 dark:text-purple-400" />}
                  valueStyle={{ color: "#9333ea", fontSize: "2rem", fontWeight: "bold" }}
                />
              </Card>
            </Col>
          </Row>

          {/* ---- SERVICES ---- */}
          {activeSection === "services" && (
            <>
              <Card 
                title={<span className="text-2xl font-bold dark:text-white"><ShoppingOutlined /> Add Service</span>} 
                className="mb-6 border border-gray-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800"
              >
                <Form form={serviceForm} layout="vertical" onFinish={onAddService}>
                  <Form.Item name="name" label={<span className="text-gray-800 dark:text-white font-bold text-base">Service Name</span>} required>
                    <Input placeholder="e.g., Bike Premium Foam, SUV Deep Clean" className="h-11 text-base font-semibold bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white border-gray-300 dark:border-gray-500 placeholder-gray-500 dark:placeholder-gray-300" />
                  </Form.Item>

                  <Form.Item name="description" label={<span className="text-gray-800 dark:text-white font-bold text-base">Description</span>}>
                    <Input placeholder="Short description (shown on site)" className="h-11 text-base bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white border-gray-300 dark:border-gray-500" />
                  </Form.Item>

                  <Row gutter={12}>
                    <Col xs={24} md={12}>
                      <Form.Item name="durationMin" label={<span className="text-gray-800 dark:text-white font-bold text-base">Duration (min)</span>}>
                        <InputNumber className="w-full h-11 bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white border-gray-300 dark:border-gray-500" placeholder="e.g., 30" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name="vehicleTags" label={<span className="text-gray-800 dark:text-white font-bold text-base">Applicable Vehicles</span>}>
                        <Form.Item name="vehicleTags" noStyle>
                          <select multiple className="input dark:bg-gray-800 dark:border-gray-600 dark:text-white w-full h-[44px]">
                            {vehicleTypeOptions.map(v => (
                              <option key={v.value} value={v.value}>{v.label}</option>
                            ))}
                          </select>
                        </Form.Item>
                      </Form.Item>
                    </Col>
                  </Row>

                  <div className="mb-2 font-semibold text-gray-700 dark:text-gray-200">Per-vehicle prices (₹)</div>
                  <Row gutter={12}>
                    {vehicleTypeOptions.map((v) => (
                      <Col xs={24} md={12} lg={8} key={v.value}>
                        <Form.Item name={["prices", v.value]} label={<span className="text-gray-800 dark:text-white text-sm font-semibold">{v.label}</span>}>
                          <InputNumber className="w-full h-10 bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white border-gray-300 dark:border-gray-500" placeholder="₹" />
                        </Form.Item>
                      </Col>
                    ))}
                  </Row>

                  <Form.Item name="isActive" valuePropName="checked" initialValue>
                    <div className="flex items-center gap-2">
                      <Switch />
                      <span className="text-gray-800 dark:text-gray-200 font-medium">Active</span>
                    </div>
                  </Form.Item>
                  <Button type="primary" htmlType="submit" block className="h-10 font-semibold text-base" icon={<PlusOutlined />}>
                    Save Service
                  </Button>
                </Form>
              </Card>

              <Card 
                title={<span className="text-2xl font-bold dark:text-white">All Services</span>} 
                className="border  border-gray-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800"
                bodyStyle={{ padding: "18px 22px" }}
              >
                <List
                  dataSource={services}
                  locale={{ emptyText: "No services added yet" }}
                  renderItem={(item) => (
                    <List.Item className="py-4 pl-6 pr-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-500 transition-colors duration-200">
                      <div className="w-full">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-lg dark:text-white">{item.name}</span>
                          <div className="flex items-center gap-2 flex-wrap justify-end">
                            {item?.prices && Object.entries(item.prices).filter(([_, val]) => val !== undefined && val !== null).map(([key, val]) => (
                              <Tag key={key} color="blue" className="mr-0">{key.toUpperCase()} ₹{val}</Tag>
                            ))}
                            {(!item?.prices || Object.keys(item.prices || {}).length === 0) && item.price !== undefined && (
                              <Tag color="green">₹{item.price}</Tag>
                            )}
                            <Tag color={item.isActive ? "green" : "red"}>
                              {item.isActive ? "Active" : "Inactive"}
                            </Tag>
                          </div>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </Card>
            </>
          )}

          {/* ---- STORES ---- */}
          {activeSection === "stores" && (
            <>
              <Card 
                title={<span className="text-2xl font-bold dark:text-white"><ShopOutlined /> Add Store</span>} 
                className="mb-6 border border-gray-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800"
              >
                <Form form={storeForm} layout="vertical" onFinish={onAddStore}>
                  <Form.Item name="name" label={<span className="text-gray-800 dark:text-white font-bold text-base">Store Name</span>} required>
                    <Input placeholder="Enter store name" className="h-11 text-base font-semibold bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white border-gray-300 dark:border-gray-500 placeholder-gray-500 dark:placeholder-gray-300" />
                  </Form.Item>
                  <Form.Item name="address" label={<span className="text-gray-800 dark:text-white font-bold text-base">Address</span>} required>
                    <Input placeholder="Enter store address" className="h-11 text-base font-semibold bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white border-gray-300 dark:border-gray-500 placeholder-gray-500 dark:placeholder-gray-300" />
                  </Form.Item>
                  <Button type="primary" htmlType="submit" block className="h-10 font-semibold text-base" icon={<PlusOutlined />}>
                    Save Store
                  </Button>
                </Form>
              </Card>

              <Card 
                title={<span className="text-2xl font-bold dark:text-white">All Stores</span>} 
                className="border border-gray-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800"
                bodyStyle={{ padding: "18px 22px" }}
              >
                <List
                  dataSource={stores}
                  locale={{ emptyText: "No stores added yet" }}
                  renderItem={(item) => (
                    <List.Item className="py-4 px-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-500 transition-colors duration-200">
                      <div className="w-full">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-lg dark:text-white">{item.name}</p>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">📍 {item.address}</p>
                          </div>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </Card>
            </>
          )}

          {/* ---- BOOKINGS ---- */}
          {activeSection === "bookings" && (
            <Card 
              title={<span className="text-2xl font-bold dark:text-white"><CalendarOutlined /> Bookings</span>}
              className="border border-gray-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800"
              bodyStyle={{ padding: "18px 22px" }}
            >
              <Table
                rowKey="_id"
                columns={bookingColumns}
                dataSource={bookings}
                loading={loadingBookings}
                pagination={{ pageSize: 10, showSizeChanger: true }}
                className="dark:text-white"
              />
            </Card>
          )}
        </Col>
      </Row>
    </div>
  )
}

export default AdminDashboard
