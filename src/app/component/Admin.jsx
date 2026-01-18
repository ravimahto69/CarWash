"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, Form, Input, InputNumber, Button, Switch, Row, Col, List, message } from 'antd'

const AdminDashboard = () => {
	const router = useRouter()
	const [serviceForm] = Form.useForm()
	const [storeForm] = Form.useForm()
	const [services, setServices] = useState([])
	const [stores, setStores] = useState([])

	// Basic auth gate: require auth_user in localStorage
	useEffect(() => {
		try {
			const authUser = localStorage.getItem('auth_user')
			if (!authUser) {
				router.push('/login')
			}
		} catch (_) {
			router.push('/login')
		}
	}, [router])

	const loadData = async () => {
		try {
			const [svcRes, storeRes] = await Promise.all([
				fetch('/api/services'),
				fetch('/api/stores'),
			])

			const svcJson = await svcRes.json()
			const storeJson = await storeRes.json()

			if (svcJson?.success) setServices(svcJson.data || [])
			if (storeJson?.success) setStores(storeJson.data || [])
		} catch (err) {
			console.error('Load data error:', err)
		}
	}

	useEffect(() => {
		loadData()
	}, [])

	const onAddService = async (values) => {
		try {
			const res = await fetch('/api/services', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(values),
			})
			const data = await res.json()
			if (!res.ok || !data?.success) {
				message.error(data?.error || 'Failed to add service')
				return
			}
			message.success('Service added')
			serviceForm.resetFields()
			loadData()
		} catch (err) {
			console.error('Add service error:', err)
			message.error('Failed to add service')
		}
	}

	const onAddStore = async (values) => {
		try {
			const res = await fetch('/api/stores', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(values),
			})
			const data = await res.json()
			if (!res.ok || !data?.success) {
				message.error(data?.error || 'Failed to add store')
				return
			}
			message.success('Store added')
			storeForm.resetFields()
			loadData()
		} catch (err) {
			console.error('Add store error:', err)
			message.error('Failed to add store')
		}
	}

	return (
		<div className="px-6 md:px-12 py-10 bg-gray-50 min-h-screen">
			<h1 className="text-3xl font-extrabold mb-6 text-red-500">Admin Dashboard</h1>

			<Row gutter={[16, 16]}>
				<Col xs={24} lg={12}>
					<Card title="Add Service" className="shadow-md">
						<Form
							form={serviceForm}
							layout="vertical"
							onFinish={onAddService}
							initialValues={{ isActive: true }}
						>
							<Form.Item label="Service Name" name="name" rules={[{ required: true, message: 'Name is required' }]}>
								<Input placeholder="Premium Wash" />
							</Form.Item>
							<Form.Item label="Description" name="description">
								<Input.TextArea rows={3} placeholder="Short description" />
							</Form.Item>
							<Row gutter={12}>
								<Col span={12}>
									<Form.Item label="Price" name="price" rules={[{ required: true, message: 'Price is required' }]}>
										<InputNumber className="w-full" min={0} prefix="₹" />
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item label="Duration" name="duration">
										<Input placeholder="e.g., 45 mins" />
									</Form.Item>
								</Col>
							</Row>
							<Form.Item label="Active" name="isActive" valuePropName="checked">
								<Switch />
							</Form.Item>
							<Button type="primary" htmlType="submit" block>
								Save Service
							</Button>
						</Form>
					</Card>

					<Card title="Services" className="shadow-md mt-4">
						<List
							dataSource={services}
							renderItem={(item) => (
								<List.Item>
									<List.Item.Meta
										title={`${item.name} — ₹${item.price ?? 0}`}
										description={item.description}
									/>
									<span className="text-sm text-gray-500">{item.duration}</span>
								</List.Item>
							)}
						/>
					</Card>
				</Col>

				<Col xs={24} lg={12}>
					<Card title="Add Store" className="shadow-md">
						<Form
							form={storeForm}
							layout="vertical"
							onFinish={onAddStore}
							initialValues={{ isActive: true }}
						>
							<Form.Item label="Store Name" name="name" rules={[{ required: true, message: 'Name is required' }]}>
								<Input placeholder="Downtown Branch" />
							</Form.Item>
							<Form.Item label="Address" name="address" rules={[{ required: true, message: 'Address is required' }]}>
								<Input placeholder="123 Main St" />
							</Form.Item>
							<Row gutter={12}>
								<Col span={12}>
									<Form.Item label="City" name="city">
										<Input />
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item label="State" name="state">
										<Input />
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={12}>
								<Col span={12}>
									<Form.Item label="ZIP" name="zip">
										<Input />
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item label="Phone" name="phone">
										<Input />
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={12}>
								<Col span={12}>
									<Form.Item label="Latitude" name="latitude">
										<InputNumber className="w-full" />
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item label="Longitude" name="longitude">
										<InputNumber className="w-full" />
									</Form.Item>
								</Col>
							</Row>
							<Form.Item label="Active" name="isActive" valuePropName="checked">
								<Switch />
							</Form.Item>
							<Button type="primary" htmlType="submit" block>
								Save Store
							</Button>
						</Form>
					</Card>

					<Card title="Nearest Stores" className="shadow-md mt-4">
						<List
							dataSource={stores}
							renderItem={(item) => (
								<List.Item>
									<List.Item.Meta
										title={item.name}
										description={`${item.address}${item.city ? ', ' + item.city : ''}${item.state ? ', ' + item.state : ''}`}
									/>
									<span className="text-sm text-gray-500">{item.phone}</span>
								</List.Item>
							)}
						/>
					</Card>
				</Col>
			</Row>
		</div>
	)
}

export default AdminDashboard
