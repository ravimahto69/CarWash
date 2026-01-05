"use client";

import React from "react";
import { Card, Row, Col, Button } from "antd";
import {
  CarOutlined,
  ToolOutlined,
  ThunderboltOutlined,
  CrownOutlined,
} from "@ant-design/icons";

const services = [
  {
    title: "Basic Car Wash",
    icon: <CarOutlined className="text-4xl text-blue-600" />,
    description:
      "Exterior wash, foam cleaning, tire wash, and quick dry to keep your car fresh.",
  },
  {
    title: "Interior Cleaning",
    icon: <ToolOutlined className="text-4xl text-green-600" />,
    description:
      "Deep interior vacuuming, dashboard polish, seat and mat cleaning.",
  },
  {
    title: "Engine Wash",
    icon: <ThunderboltOutlined className="text-4xl text-orange-600" />,
    description:
      "Safe and professional engine cleaning for better performance and durability.",
  },
  {
    title: "Premium Detailing",
    icon: <CrownOutlined className="text-4xl text-purple-600" />,
    description:
      "Complete car detailing including polishing, waxing, and paint protection.",
  },
];

const ServicesPage = () => {
  return (
    <div className="px-6 md:px-20 py-16 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-800">
          Our Car Wash Services
        </h1>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          We provide professional and affordable car wash services to keep your
          vehicle clean, shiny, and protected.
        </p>
      </div>

      {/* Services Grid */}
      <Row gutter={[24, 24]}>
        {services.map((service, index) => (
          <Col xs={24} sm={12} md={12} lg={6} key={index}>
            <Card
              hoverable
              className="rounded-2xl shadow-md h-full"
            >
              <div className="flex flex-col items-center text-center gap-4">
                {service.icon}
                <h3 className="text-xl font-bold text-gray-800">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {service.description}
                </p>

                <Button
                  type="primary"
                  size="large"
                  className="mt-4"
                  href="/book"
                >
                  Book Now
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ServicesPage
      