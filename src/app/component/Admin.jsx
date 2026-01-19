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
  Modal,
  Popconfirm,
} from "antd"
import {
  ShoppingOutlined,
  ShopOutlined,
  CalendarOutlined,
  LogoutOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  EditOutlined,
  DeleteOutlined,
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

  const [editingService, setEditingService] = useState(null)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)

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

  /* ---------------- EDIT SERVICE MODAL -------- */
  const openEditModal = (service) => {
    setEditingService(service)
    serviceForm.setFieldsValue({
      name: service.name,
      description: service.description,
      durationMin: service.durationMin,
      vehicleTags: service.vehicleTags || [],
      prices: service.prices || {},
      isActive: service.isActive,
    })
    setIsEditModalVisible(true)
  }

  const onEditService = async (values) => {
    if (!editingService) return
    try {
      const res = await fetch(`/api/services/${editingService._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      const data = await res.json()

      if (!res.ok) return message.error(data.error || "Update failed")
      message.success("Service updated")
      setIsEditModalVisible(false)
      setEditingService(null)
      serviceForm.resetFields()
      loadData()
    } catch {
      message.error("Service update failed")
    }
  }

  /* ------------ DELETE SERVICE ----------- */
  const onDeleteService = async (serviceId) => {
    try {
      const res = await fetch(`/api/services/${serviceId}`, {
        method: "DELETE",
      })
      const data = await res.json()

      if (!res.ok) return message.error(data.error || "Delete failed")
      message.success("Service deleted")
      loadData()
    } catch {
      message.error("Service deletion failed")
    }
  }

  /* ---------------- ADD STORE ---------------- */
  const onAddStore = async (values) => {
    try {
      // Create location object for GeoJSON format
      const storeData = {
        ...values,
        location: {
          type: 'Point',
          coordinates: [values.longitude, values.latitude] // [longitude, latitude] for GeoJSON
        }
      }
      
      const res = await fetch("/api/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storeData),
      })
      const data = await res.json()

      if (!res.ok) return message.error(data.error)
      message.success("Store added successfully!")
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
                className="mb-6 border-2 border-blue-300 dark:border-blue-600 shadow-xl bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900"
              >
                <Form form={serviceForm} layout="vertical" onFinish={onAddService}>
                  {/* Basic Info Section */}
                  <div className="bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800 p-6 rounded-xl mb-6 border-2 border-blue-300 dark:border-blue-600 shadow-md">
                    <h3 className="font-bold text-lg text-blue-900 dark:text-blue-100 mb-5 flex items-center gap-2">
                      <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                      Basic Information
                    </h3>
                    
                    <Form.Item name="name" label={<span className="text-gray-800 dark:text-white font-bold text-sm">Service Name *</span>} required>
                      <Input 
                        placeholder="e.g., Bike Premium Foam" 
                        className="h-12 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base border-2 border-blue-300 dark:border-blue-500 rounded-lg shadow-sm hover:border-blue-400 focus:border-blue-500 placeholder-blue-500 dark:placeholder-blue-300 font-semibold"
                      />
                    </Form.Item>

                    <Form.Item name="description" label={<span className="text-gray-800 dark:text-white font-bold text-sm">What&apos;s Included</span>}>
                      <Input 
                        placeholder="e.g., Foam wash + chain clean + polish" 
                        className="h-12 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base border-2 border-blue-300 dark:border-blue-500 rounded-lg shadow-sm hover:border-blue-400 focus:border-blue-500 placeholder-blue-500 dark:placeholder-blue-300"
                      />
                    </Form.Item>

                    <Form.Item name="durationMin" label={<span className="text-gray-800 dark:text-white font-bold text-sm">Duration (minutes)</span>}>
                      <InputNumber 
                        placeholder="30" 
                        className="w-full h-12 bg-white dark:bg-gray-700 text-base border-2 border-blue-300 dark:border-blue-500 rounded-lg shadow-sm hover:border-blue-400 focus:border-blue-500 placeholder-blue-500 dark:placeholder-blue-300 [&>input]:text-gray-900 dark:[&>input]:text-white [&>input]:font-semibold"
                        min={1}
                        type="number"
                        parser={(value) => {
                          const num = parseInt(value);
                          return isNaN(num) ? undefined : num;
                        }}
                      />
                    </Form.Item>
                  </div>

                  {/* Vehicles & Pricing Section */}
                  <div className="bg-gradient-to-r from-green-100 to-green-50 dark:from-green-900 dark:to-green-800 p-6 rounded-xl mb-6 border-2 border-green-300 dark:border-green-600 shadow-md">
                    <h3 className="font-bold text-lg text-green-900 dark:text-green-100 mb-2 flex items-center gap-2">
                      <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                      Select Vehicles & Set Prices
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-5 ml-8">Choose which vehicles this service applies to and set the price for each</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 ml-2">
                      {vehicleTypeOptions.map((v) => (
                        <div key={v.value} className="bg-white dark:bg-gray-700 p-4 rounded-xl border-2 border-green-200 dark:border-green-600 hover:border-green-400 hover:shadow-lg transition-all duration-200 cursor-pointer">
                          <label className="flex items-start gap-3 cursor-pointer">
                            <input 
                              type="checkbox" 
                              value={v.value}
                              onChange={(e) => {
                                const currentTags = serviceForm.getFieldValue("vehicleTags") || [];
                                if (e.target.checked) {
                                  serviceForm.setFieldValue("vehicleTags", [...currentTags, v.value]);
                                } else {
                                  serviceForm.setFieldValue("vehicleTags", currentTags.filter(tag => tag !== v.value));
                                }
                              }}
                              className="w-5 h-5 rounded cursor-pointer mt-1 accent-green-500"
                            />
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{v.label}</span>
                          </label>
                        </div>
                      ))}
                    </div>

                    <div className="bg-white dark:bg-gray-700 p-6 rounded-xl border-2 border-green-300 dark:border-green-600 shadow-sm">
                      <p className="text-sm font-bold text-green-900 dark:text-green-100 mb-5 flex items-center gap-2">
                        <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">₹</span>
                        Set Prices for Selected Vehicles
                      </p>
                      <Row gutter={[12, 12]}>
                        {vehicleTypeOptions.map((v) => (
                          <Col xs={24} sm={12} md={6} key={v.value}>
                            <Form.Item name={["prices", v.value]} label={<span className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-2">{v.label}</span>}>
                              <InputNumber 
                                placeholder="0" 
                                className="w-full h-11 bg-white dark:bg-gray-700 text-base border-2 border-green-300 dark:border-green-500 rounded-lg shadow-sm hover:border-green-400 focus:border-green-500 placeholder-green-500 dark:placeholder-green-300 [&>input]:text-gray-900 dark:[&>input]:text-white [&>input]:font-bold"
                                min={0}
                                type="number"
                                prefix="₹"
                                parser={(value) => {
                                  const num = parseInt(value);
                                  return isNaN(num) ? undefined : num;
                                }}
                              />
                            </Form.Item>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  </div>

                  {/* Status Section */}
                  <div className="bg-gradient-to-r from-purple-100 to-purple-50 dark:from-purple-900 dark:to-purple-800 p-6 rounded-xl mb-6 border-2 border-purple-300 dark:border-purple-600 shadow-md flex items-center justify-between">
                    <div>
                      <p className="font-bold text-lg text-purple-900 dark:text-purple-100 flex items-center gap-2 mb-1">
                        <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                        Service Status
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 ml-8">Enable this service for customer bookings</p>
                    </div>
                    <Form.Item name="isActive" valuePropName="checked" initialValue className="mb-0">
                      <Switch size="large" />
                    </Form.Item>
                  </div>

                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    block 
                    className="h-13 font-bold text-base bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-none shadow-lg hover:shadow-xl transition-all duration-200" 
                    icon={<PlusOutlined className="text-lg" />}
                  >
                    Create Service
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
                          <div className="flex-1">
                            <span className="font-semibold text-lg dark:text-white">{item.name}</span>
                            {item.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.description}</p>
                            )}
                          </div>
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
                            <Button 
                              type="primary" 
                              size="small"
                              icon={<EditOutlined />}
                              onClick={() => openEditModal(item)}
                              className="ml-2"
                            >
                              Edit
                            </Button>
                            <Popconfirm
                              title="Delete Service"
                              description="Are you sure you want to delete this service?"
                              onConfirm={() => onDeleteService(item._id)}
                              okText="Yes"
                              cancelText="No"
                              okButtonProps={{ danger: true }}
                            >
                              <Button 
                                type="primary"
                                danger
                                size="small"
                                icon={<DeleteOutlined />}
                              >
                                Delete
                              </Button>
                            </Popconfirm>
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

                  <Form.Item name="phone" label={<span className="text-gray-800 dark:text-white font-bold text-base">Phone Number</span>} required>
                    <Input placeholder="Enter phone number (e.g., +91 9876543210)" className="h-11 text-base font-semibold bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white border-gray-300 dark:border-gray-500 placeholder-gray-500 dark:placeholder-gray-300" />
                  </Form.Item>

                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item name="latitude" label={<span className="text-gray-800 dark:text-white font-bold text-base">Latitude</span>} required>
                        <InputNumber placeholder="e.g., 40.7128" step={0.0001} className="h-11 w-full text-base font-semibold bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white border-gray-300 dark:border-gray-500" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name="longitude" label={<span className="text-gray-800 dark:text-white font-bold text-base">Longitude</span>} required>
                        <InputNumber placeholder="e.g., -74.0060" step={0.0001} className="h-11 w-full text-base font-semibold bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white border-gray-300 dark:border-gray-500" />
                      </Form.Item>
                    </Col>
                  </Row>

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
                          <div className="flex-1">
                            <p className="font-semibold text-lg dark:text-white">{item.name}</p>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">📍 {item.address}</p>
                            {item.phone && <p className="text-gray-600 dark:text-gray-400 mt-1">📞 {item.phone}</p>}
                            {item.latitude && item.longitude && (
                              <p className="text-gray-600 dark:text-gray-400 mt-1">🧭 {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}</p>
                            )}
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

      {/* --------- EDIT SERVICE MODAL ---------- */}
      <Modal
        title={<span className="text-2xl font-bold text-gray-800 dark:text-black">✏️ Edit Service</span>}
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false)
          setEditingService(null)
          serviceForm.resetFields()
        }}
        footer={null}
        width={800}
        className="dark:bg-gray-900"
        bodyStyle={{ backgroundColor: '#f9fafb', padding: '24px' }}
      >
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6">
          <Form form={serviceForm} layout="vertical" onFinish={onEditService}>
            {/* Basic Info Section */}
            <div className="bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800 p-6 rounded-xl mb-6 border-2 border-blue-300 dark:border-blue-600 shadow-md">
              <h3 className="font-bold text-lg text-blue-900 dark:text-blue-100 mb-5 flex items-center gap-2">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                Basic Information
              </h3>
              
              <Form.Item name="name" label={<span className="text-gray-800 dark:text-white font-bold text-sm">Service Name *</span>} required>
                <Input 
                  placeholder="e.g., Bike Premium Foam" 
                  className="h-12 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base border-2 border-blue-300 dark:border-blue-500 rounded-lg shadow-sm hover:border-blue-400 focus:border-blue-500 placeholder-blue-500 dark:placeholder-blue-300 font-semibold"
                />
              </Form.Item>

              <Form.Item name="description" label={<span className="text-gray-800 dark:text-white font-bold text-sm">What&apos;s Included</span>}>
                <Input 
                  placeholder="e.g., Foam wash + chain clean + polish" 
                  className="h-12 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base border-2 border-blue-300 dark:border-blue-500 rounded-lg shadow-sm hover:border-blue-400 focus:border-blue-500 placeholder-blue-500 dark:placeholder-blue-300"
                />
              </Form.Item>

              <Form.Item name="durationMin" label={<span className="text-gray-800 dark:text-white font-bold text-sm">Duration (minutes)</span>}>
                <InputNumber 
                  placeholder="30" 
                  className="w-full h-12 bg-white dark:bg-gray-700 text-base border-2 border-blue-300 dark:border-blue-500 rounded-lg shadow-sm hover:border-blue-400 focus:border-blue-500 placeholder-blue-500 dark:placeholder-blue-300 [&>input]:text-gray-900 dark:[&>input]:text-white [&>input]:font-semibold"
                  min={1}
                  type="number"
                  parser={(value) => {
                    const num = parseInt(value);
                    return isNaN(num) ? undefined : num;
                  }}
                />
              </Form.Item>
            </div>

            {/* Vehicles & Pricing Section */}
            <div className="bg-gradient-to-r from-green-100 to-green-50 dark:from-green-900 dark:to-green-800 p-6 rounded-xl mb-6 border-2 border-green-300 dark:border-green-600 shadow-md">
              <h3 className="font-bold text-lg text-green-900 dark:text-green-100 mb-2 flex items-center gap-2">
                <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                Select Vehicles & Set Prices
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-5 ml-8">Choose which vehicles this service applies to and set the price for each</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6 ml-2">
                {vehicleTypeOptions.map((v) => (
                  <div key={v.value} className="bg-white dark:bg-gray-700 p-4 rounded-xl border-2 border-green-200 dark:border-green-600 hover:border-green-400 hover:shadow-lg transition-all duration-200 cursor-pointer">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        value={v.value}
                        onChange={(e) => {
                          const currentTags = serviceForm.getFieldValue("vehicleTags") || [];
                          if (e.target.checked) {
                            serviceForm.setFieldValue("vehicleTags", [...currentTags, v.value]);
                          } else {
                            serviceForm.setFieldValue("vehicleTags", currentTags.filter(tag => tag !== v.value));
                          }
                        }}
                        className="w-5 h-5 rounded cursor-pointer mt-1 accent-green-500"
                      />
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{v.label}</span>
                    </label>
                  </div>
                ))}
              </div>

              <div className="bg-white dark:bg-gray-700 p-6 rounded-xl border-2 border-green-300 dark:border-green-600 shadow-sm">
                <p className="text-sm font-bold text-green-900 dark:text-green-100 mb-5 flex items-center gap-2">
                  <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">₹</span>
                  Set Prices (₹) for Selected Vehicles
                </p>
                <Row gutter={[12, 12]}>
                  {vehicleTypeOptions.map((v) => (
                    <Col xs={24} sm={12} md={8} key={v.value}>
                      <Form.Item name={["prices", v.value]} label={<span className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-2">{v.label}</span>}>
                        <InputNumber 
                          placeholder="0" 
                          className="w-full h-11 bg-white dark:bg-gray-700 text-base border-2 border-green-300 dark:border-green-500 rounded-lg shadow-sm hover:border-green-400 focus:border-green-500 placeholder-green-500 dark:placeholder-green-300 [&>input]:text-gray-900 dark:[&>input]:text-white [&>input]:font-bold"
                          min={0}
                          type="number"
                          prefix="₹"
                          parser={(value) => {
                            const num = parseInt(value);
                            return isNaN(num) ? undefined : num;
                          }}
                        />
                      </Form.Item>
                    </Col>
                  ))}
                </Row>
              </div>
            </div>

            {/* Status Section */}
            <div className="bg-gradient-to-r from-purple-100 to-purple-50 dark:from-purple-900 dark:to-purple-800 p-6 rounded-xl mb-6 border-2 border-purple-300 dark:border-purple-600 shadow-md flex items-center justify-between">
              <div>
                <p className="font-bold text-lg text-purple-900 dark:text-purple-100 flex items-center gap-2 mb-1">
                  <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                  Service Status
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 ml-8">Enable this service for customer bookings</p>
              </div>
              <Form.Item name="isActive" valuePropName="checked" className="mb-0">
                <Switch size="large" />
              </Form.Item>
            </div>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                block 
                className="h-12 font-bold text-base bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-none shadow-lg hover:shadow-xl transition-all duration-200"
              >
                💾 Update Service
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  )
}

export default AdminDashboard
