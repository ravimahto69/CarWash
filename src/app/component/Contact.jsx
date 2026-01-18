'use client'
import { Form, Input, Button, message } from "antd";

const { TextArea } = Input;

export default function ContactUs() {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      const data = await res.json()

      if (!res.ok || !data?.success) {
        throw new Error(data?.error || 'Failed to submit')
      }

      message.success('Your message has been sent!')
      form.resetFields()
    } catch (err) {
      console.error('Contact submit error:', err)
      message.error(err.message || 'Something went wrong. Please try again.')
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4 transition-colors">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-lg grid md:grid-cols-2">
        
        {/* Left Section */}
        <div className="bg-blue-600 dark:bg-blue-900 text-white p-8 rounded-t-xl md:rounded-l-xl md:rounded-tr-none">
          <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
          <p className="text-blue-100 dark:text-blue-200 mb-6">
            Have questions or feedback? We’d love to hear from you.
          </p>

          <div className="space-y-4 text-sm">
            <p>📍 Bhopal Mp India</p>
            <p>📞 +91 8709472551</p>
            <p>✉️ washHubsupport@gmail.com</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="p-8">
          <Form
            form={form}
            layout="vertical" 
            onFinish={handleSubmit} 
            className="space-y-2"
          >
            <Form.Item
              label={<span className="dark:text-gray-300">Full Name</span>}
              name="name"
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <Input placeholder="John Doe" className="dark:bg-gray-700 dark:text-white dark:border-gray-600" />
            </Form.Item>

            <Form.Item
              label={<span className="dark:text-gray-300">Email Address</span>}
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Enter a valid email" },
              ]}
            >
              <Input placeholder="john@example.com" className="dark:bg-gray-700 dark:text-white dark:border-gray-600" />
            </Form.Item>

            <Form.Item
              label={<span className="dark:text-gray-300">Message</span>}
              name="message"
              rules={[{ required: true, message: "Please enter your message" }]}
            >
              <TextArea rows={4} placeholder="How can we help you?" className="dark:bg-gray-700 dark:text-white dark:border-gray-600" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Send Message
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
