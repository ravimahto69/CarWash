'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Input, Button, message, Spin, Tabs, Modal, Form } from 'antd';
import { UserOutlined, HomeOutlined, CreditCardOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const UserProfile = ({ userEmail }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [editingPayment, setEditingPayment] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Profile form
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    bio: '',
  });

  // Address form
  const [addressData, setAddressData] = useState({
    label: 'home',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    isDefault: false,
  });

  // Payment form
  const [paymentData, setPaymentData] = useState({
    type: 'credit_card',
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cardBrand: '',
    upiId: '',
    isDefault: false,
  });

  const loadUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/user/profile?email=${userEmail}`);
      const data = await res.json();
      if (data.success) {
        setUser(data.data);
        setProfileData({
          name: data.data.name,
          phone: data.data.phone || '',
          bio: data.data.bio || '',
        });
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
      message.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  const handleProfileUpdate = async () => {
    try {
      setUpdating(true);
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          ...profileData,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setUser(data.data);
        setIsEditingProfile(false);
        message.success('Profile updated successfully');
      } else {
        message.error(data.error || 'Failed to update profile');
      }
    } catch (err) {
      message.error('Error updating profile');
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleAddAddress = async () => {
    if (!addressData.street || !addressData.city || !addressData.state || !addressData.zipCode) {
      message.error('Please fill all required address fields');
      return;
    }

    try {
      setUpdating(true);
      const url = editingAddress ? `/api/user/addresses` : `/api/user/addresses`;
      const method = editingAddress ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          addressId: editingAddress?._id,
          ...addressData,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setUser(data.data);
        message.success(editingAddress ? 'Address updated successfully' : 'Address added successfully');
        setShowAddressModal(false);
        setEditingAddress(null);
        setAddressData({
          label: 'home',
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'India',
          isDefault: false,
        });
      } else {
        message.error(data.error || 'Failed to save address');
      }
    } catch (err) {
      message.error('Error saving address');
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    Modal.confirm({
      title: 'Delete Address',
      content: 'Are you sure you want to delete this address?',
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          setUpdating(true);
          const res = await fetch(`/api/user/addresses?email=${userEmail}&addressId=${addressId}`, {
            method: 'DELETE',
          });

          const data = await res.json();
          if (data.success) {
            setUser(data.data);
            message.success('Address deleted successfully');
          } else {
            message.error(data.error || 'Failed to delete address');
          }
        } catch (err) {
          message.error('Error deleting address');
          console.error(err);
        } finally {
          setUpdating(false);
        }
      },
    });
  };

  const handleAddPayment = async () => {
    if (!paymentData.cardNumber || !paymentData.cardHolder) {
      message.error('Please fill all required payment fields');
      return;
    }

    try {
      setUpdating(true);
      const res = await fetch('/api/user/payment-methods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          ...paymentData,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setUser(data.data);
        message.success('Payment method added successfully');
        setShowPaymentModal(false);
        setPaymentData({
          type: 'credit_card',
          cardNumber: '',
          cardHolder: '',
          expiryMonth: '',
          expiryYear: '',
          cardBrand: '',
          upiId: '',
          isDefault: false,
        });
      } else {
        message.error(data.error || 'Failed to add payment method');
      }
    } catch (err) {
      message.error('Error adding payment method');
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeletePayment = async (paymentMethodId) => {
    Modal.confirm({
      title: 'Delete Payment Method',
      content: 'Are you sure you want to delete this payment method?',
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          setUpdating(true);
          const res = await fetch(`/api/user/payment-methods?email=${userEmail}&paymentMethodId=${paymentMethodId}`, {
            method: 'DELETE',
          });

          const data = await res.json();
          if (data.success) {
            setUser(data.data);
            message.success('Payment method deleted successfully');
          } else {
            message.error(data.error || 'Failed to delete payment method');
          }
        } catch (err) {
          message.error('Error deleting payment method');
          console.error(err);
        } finally {
          setUpdating(false);
        }
      },
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl ">
      <Spin spinning={updating}>
        <Tabs
          defaultActiveKey="1"
          className="custom-tabs text-yellow-50"
          items={[
            {
              key: '1',
              label: (
                <span className="flex items-center gap-2 font-semibold text-white dark:text-white hover:text-blue-400 dark:hover:text-blue-300 transition-colors">
                  <UserOutlined /> Profile Information
                </span>
              ),
              children: isEditingProfile ? (
                <Card className="mt-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow rounded-lg">
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold mb-3 text-gray-700 dark:text-gray-200">
                        👤 Name *
                      </label>
                      <Input
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData({ ...profileData, name: e.target.value })
                        }
                        placeholder="Enter your full name"
                        size="large"
                        className="!bg-gray-50 dark:!bg-gray-700 !text-gray-900 dark:!text-white !border-gray-300 dark:!border-gray-600 rounded-lg transition-all focus:!border-blue-500 dark:focus:!border-blue-400"
                        style={{ color: 'inherit' }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-3 text-gray-700 dark:text-gray-200">
                        📧 Email
                      </label>
                      <Input
                        value={userEmail}
                        disabled
                        placeholder="Email"
                        size="large"
                        className="!bg-gray-100 dark:!bg-gray-700 !text-gray-600 dark:!text-gray-400 !border-gray-300 dark:!border-gray-600 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-3 text-gray-700 dark:text-gray-200">
                        📱 Phone
                      </label>
                      <Input
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData({ ...profileData, phone: e.target.value })
                        }
                        placeholder="Enter your phone number"
                        size="large"
                        className="!bg-gray-50 dark:!bg-gray-700 !text-gray-900 dark:!text-white !border-gray-300 dark:!border-gray-600 rounded-lg transition-all focus:!border-blue-500 dark:focus:!border-blue-400"
                        style={{ color: 'inherit' }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-3 text-gray-700 dark:text-gray-200">
                        ✍️ Bio
                      </label>
                      <Input.TextArea
                        value={profileData.bio}
                        onChange={(e) =>
                          setProfileData({ ...profileData, bio: e.target.value })
                        }
                        placeholder="Tell us about yourself (max 500 characters)"
                        maxLength={500}
                        rows={4}
                        showCount
                        className="!bg-gray-50 dark:!bg-gray-700 !text-gray-900 dark:!text-white !border-gray-300 dark:!border-gray-600 rounded-lg transition-all focus:!border-blue-500 dark:focus:!border-blue-400"
                        style={{ color: 'inherit' }}
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="primary"
                        size="large"
                        loading={updating}
                        onClick={handleProfileUpdate}
                        className="!bg-gradient-to-r !from-blue-600 !to-blue-700 dark:!from-blue-500 dark:!to-blue-600 !border-0 !font-bold !h-11 !rounded-lg hover:!shadow-lg transition-all flex-1"
                      >
                        💾 Save Changes
                      </Button>
                      <Button
                        size="large"
                        onClick={() => {
                          setIsEditingProfile(false);
                          setProfileData({
                            name: user?.name || '',
                            phone: user?.phone || '',
                            bio: user?.bio || '',
                          });
                        }}
                        className="!font-bold !h-11 !rounded-lg flex-1"
                      >
                        ❌ Cancel
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="mt-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow rounded-lg">
                  <div className="space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">👤 Profile Information</h3>
                        
                        <div className="space-y-4">
                          <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">NAME</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">{user?.name || 'Not provided'}</p>
                          </div>

                          <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">EMAIL</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">{userEmail}</p>
                          </div>

                          <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">PHONE</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">{user?.phone || 'Not provided'}</p>
                          </div>

                          <div>
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">BIO</p>
                            <p className="text-base text-gray-700 dark:text-gray-300 italic">
                              {user?.bio || 'No bio added yet'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <Button
                        type="primary"
                        icon={<EditOutlined />}
                        size="large"
                        onClick={() => setIsEditingProfile(true)}
                        className="!bg-gradient-to-r !from-blue-600 !to-blue-700 dark:!from-blue-500 dark:!to-blue-600 !border-0 !font-bold !h-11 !rounded-lg hover:!shadow-lg transition-all ml-4"
                      >
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                </Card>
              ),
            },
            {
              key: '2',
              label: (
                <span className="flex items-center gap-2 font-semibold text-white dark:text-white hover:text-green-400 dark:hover:text-green-300 transition-colors">
                  <HomeOutlined /> Addresses
                </span>
              ),
              children: (
                <div className="mt-6">
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setEditingAddress(null);
                      setAddressData({
                        label: 'home',
                        street: '',
                        city: '',
                        state: '',
                        zipCode: '',
                        country: 'India',
                        isDefault: false,
                      });
                      setShowAddressModal(true);
                    }}
                    className="!bg-gradient-to-r !from-green-600 !to-green-700 dark:!from-green-500 dark:!to-green-600 !border-0 !font-bold !h-10 !rounded-lg mb-6 hover:!shadow-lg transition-all"
                  >
                    + Add New Address
                  </Button>

                  <div className="space-y-4">
                    {user?.addresses?.length === 0 ? (
                      <div className="text-center py-10 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                        <p className="text-gray-500 dark:text-gray-400 font-semibold">📍 No addresses yet. Add one to get started!</p>
                      </div>
                    ) : (
                      user?.addresses?.map((address) => (
                        <Card
                          key={address._id}
                          className="!bg-gradient-to-br !from-white !to-gray-50 dark:!from-gray-800 dark:!to-gray-750 !border !border-gray-200 dark:!border-gray-700 !shadow-sm hover:!shadow-md transition-all rounded-lg"
                          title={
                            <div className="flex items-center justify-between py-2">
                              <span className="font-bold text-gray-900 dark:text-white">
                                📍 {address.label.toUpperCase()}
                                {address.isDefault && (
                                  <span className="ml-3 px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800 text-blue-700 dark:text-blue-300 rounded-full text-xs font-bold">
                                    ★ Default
                                  </span>
                                )}
                              </span>
                              <div className="flex gap-2">
                                <Button
                                  type="text"
                                  icon={<EditOutlined />}
                                  onClick={() => {
                                    setEditingAddress(address);
                                    setAddressData(address);
                                    setShowAddressModal(true);
                                  }}
                                  size="small"
                                  className="!text-blue-600 dark:!text-blue-400 hover:!text-blue-700 dark:hover:!text-blue-300"
                                />
                                <Button
                                  type="text"
                                  danger
                                  icon={<DeleteOutlined />}
                                  onClick={() => handleDeleteAddress(address._id)}
                                  size="small"
                                  className="!text-red-600 dark:!text-red-400 hover:!text-red-700 dark:hover:!text-red-300"
                                />
                              </div>
                            </div>
                          }
                        >
                          <p className="text-gray-800 dark:text-gray-200 font-semibold">{address.street}</p>
                          <p className="text-gray-700 dark:text-gray-300">
                            {address.city}, {address.state} {address.zipCode}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">🌍 {address.country}</p>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              ),
            },
            {
              key: '3',
              label: (
                <span className="flex items-center gap-2 font-semibold text-white dark:text-white hover:text-purple-400 dark:hover:text-purple-300 transition-colors">
                  <CreditCardOutlined /> Payment Methods
                </span>
              ),
              children: (
                <div className="mt-6">
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setEditingPayment(null);
                      setPaymentData({
                        type: 'credit_card',
                        cardNumber: '',
                        cardHolder: '',
                        expiryMonth: '',
                        expiryYear: '',
                        cardBrand: '',
                        upiId: '',
                        isDefault: false,
                      });
                      setShowPaymentModal(true);
                    }}
                    className="!bg-gradient-to-r !from-purple-600 !to-purple-700 dark:!from-purple-500 dark:!to-purple-600 !border-0 !font-bold !h-10 !rounded-lg mb-6 hover:!shadow-lg transition-all"
                  >
                    + Add Payment Method
                  </Button>

                  <div className="space-y-4">
                    {user?.paymentMethods?.length === 0 ? (
                      <div className="text-center py-10 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                        <p className="text-gray-500 dark:text-gray-400 font-semibold">💳 No payment methods yet. Add one to checkout faster!</p>
                      </div>
                    ) : (
                      user?.paymentMethods?.map((method) => (
                        <Card
                          key={method._id}
                          className="!bg-gradient-to-br !from-white !to-gray-50 dark:!from-gray-800 dark:!to-gray-750 !border !border-gray-200 dark:!border-gray-700 !shadow-sm hover:!shadow-md transition-all rounded-lg"
                          title={
                            <div className="flex items-center justify-between py-2">
                              <span className="font-bold text-gray-900 dark:text-white text-lg">
                                {method.type === 'credit_card' ? '🔴 Credit Card' : method.type === 'debit_card' ? '🟢 Debit Card' : method.type === 'upi' ? '📱 UPI' : '💰 Wallet'}
                                {method.isDefault && (
                                  <span className="ml-3 px-3 py-1 bg-gradient-to-r from-purple-100 to-purple-50 dark:from-purple-900 dark:to-purple-800 text-purple-700 dark:text-purple-300 rounded-full text-xs font-bold">
                                    ★ Default
                                  </span>
                                )}
                              </span>
                              <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => handleDeletePayment(method._id)}
                                size="small"
                                className="!text-red-600 dark:!text-red-400 hover:!text-red-700 dark:hover:!text-red-300"
                              />
                            </div>
                          }
                        >
                          {method.cardNumber && (
                            <>
                              <p className="text-gray-800 dark:text-gray-200 font-semibold">Card: **** **** **** {method.cardNumber.slice(-4)}</p>
                              <p className="text-gray-700 dark:text-gray-300">Holder: {method.cardHolder}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                ⏰ Expires: {method.expiryMonth}/{method.expiryYear}
                              </p>
                            </>
                          )}
                          {method.upiId && <p className="text-gray-800 dark:text-gray-200 font-semibold">UPI: {method.upiId}</p>}
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              ),
            },
          ]}
          tabBarStyle={{
            backgroundColor: 'transparent',
            borderBottom: '2px solid #e5e7eb',
          }}
        />

        {/* Address Modal */}
        <Modal
          title={
            <span className="font-bold text-lg text-gray-900 dark:text-white">
              {editingAddress ? '📍 Edit Address' : '📍 Add New Address'}
            </span>
          }
          open={showAddressModal}
          onOk={handleAddAddress}
          onCancel={() => setShowAddressModal(false)}
          loading={updating}
          okText={editingAddress ? 'Update' : 'Add'}
          className="dark:bg-gray-800"
          styles={{
            content: {
              backgroundColor: 'var(--bg-color)',
            },
          }}
        >
          <div className="space-y-4 mt-6 bg-white dark:bg-gray-800 rounded-lg p-4">
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-200">Label</label>
              <select
                value={addressData.label}
                onChange={(e) =>
                  setAddressData({ ...addressData, label: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-gray-50 border-gray-300 font-semibold transition-all focus:border-blue-500 dark:focus:border-blue-400"
              >
                <option value="home">🏠 Home</option>
                <option value="work">🏢 Work</option>
                <option value="other">📌 Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-200">Street *</label>
              <Input
                value={addressData.street}
                onChange={(e) =>
                  setAddressData({ ...addressData, street: e.target.value })
                }
                placeholder="Street address"
                className="!bg-gray-50 dark:!bg-gray-700 !text-gray-900 dark:!text-white !border-gray-300 dark:!border-gray-600 rounded-lg transition-all focus:!border-blue-500 dark:focus:!border-blue-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-200">City *</label>
                <Input
                  value={addressData.city}
                  onChange={(e) =>
                    setAddressData({ ...addressData, city: e.target.value })
                  }
                  placeholder="City"
                  className="!bg-gray-50 dark:!bg-gray-700 !text-gray-900 dark:!text-white !border-gray-300 dark:!border-gray-600 rounded-lg transition-all focus:!border-blue-500 dark:focus:!border-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-200">State *</label>
                <Input
                  value={addressData.state}
                  onChange={(e) =>
                    setAddressData({ ...addressData, state: e.target.value })
                  }
                  placeholder="State"
                  className="!bg-gray-50 dark:!bg-gray-700 !text-gray-900 dark:!text-white !border-gray-300 dark:!border-gray-600 rounded-lg transition-all focus:!border-blue-500 dark:focus:!border-blue-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-200">ZIP Code *</label>
                <Input
                  value={addressData.zipCode}
                  onChange={(e) =>
                    setAddressData({ ...addressData, zipCode: e.target.value })
                  }
                  placeholder="ZIP code"
                  className="!bg-gray-50 dark:!bg-gray-700 !text-gray-900 dark:!text-white !border-gray-300 dark:!border-gray-600 rounded-lg transition-all focus:!border-blue-500 dark:focus:!border-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-200">Country</label>
                <Input
                  value={addressData.country}
                  onChange={(e) =>
                    setAddressData({ ...addressData, country: e.target.value })
                  }
                  placeholder="Country"
                  className="!bg-gray-50 dark:!bg-gray-700 !text-gray-900 dark:!text-white !border-gray-300 dark:!border-gray-600 rounded-lg transition-all focus:!border-blue-500 dark:focus:!border-blue-400"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
              <input
                type="checkbox"
                checked={addressData.isDefault}
                onChange={(e) =>
                  setAddressData({ ...addressData, isDefault: e.target.checked })
                }
                className="w-5 h-5 rounded accent-blue-600 dark:accent-blue-400"
              />
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Set as default address</label>
            </div>
          </div>
        </Modal>

        {/* Payment Modal */}
        <Modal
          title={
            <span className="font-bold text-lg text-gray-900 dark:text-white">
              💳 Add Payment Method
            </span>
          }
          open={showPaymentModal}
          onOk={handleAddPayment}
          onCancel={() => setShowPaymentModal(false)}
          loading={updating}
          okText="Add"
          className="dark:bg-gray-800"
          styles={{
            content: {
              backgroundColor: 'var(--bg-color)',
            },
          }}
        >
          <div className="space-y-4 mt-6 bg-white dark:bg-gray-800 rounded-lg p-4">
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-200">Payment Type</label>
              <select
                value={paymentData.type}
                onChange={(e) =>
                  setPaymentData({ ...paymentData, type: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-gray-50 border-gray-300 font-semibold transition-all focus:border-blue-500 dark:focus:border-blue-400"
              >
                <option value="credit_card">🔴 Credit Card</option>
                <option value="debit_card">🟢 Debit Card</option>
                <option value="upi">📱 UPI</option>
              </select>
            </div>

            {(paymentData.type === 'credit_card' || paymentData.type === 'debit_card') && (
              <>
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-200">Card Number *</label>
                  <Input
                    value={paymentData.cardNumber}
                    onChange={(e) =>
                      setPaymentData({ ...paymentData, cardNumber: e.target.value })
                    }
                    placeholder="Last 4 digits or full number"
                    className="!bg-gray-50 dark:!bg-gray-700 !text-gray-900 dark:!text-white !border-gray-300 dark:!border-gray-600 rounded-lg transition-all focus:!border-blue-500 dark:focus:!border-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-200">Card Holder *</label>
                  <Input
                    value={paymentData.cardHolder}
                    onChange={(e) =>
                      setPaymentData({ ...paymentData, cardHolder: e.target.value })
                    }
                    placeholder="Name on card"
                    className="!bg-gray-50 dark:!bg-gray-700 !text-gray-900 dark:!text-white !border-gray-300 dark:!border-gray-600 rounded-lg transition-all focus:!border-blue-500 dark:focus:!border-blue-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-200">Expiry Month</label>
                    <Input
                      value={paymentData.expiryMonth}
                      onChange={(e) =>
                        setPaymentData({ ...paymentData, expiryMonth: e.target.value })
                      }
                      placeholder="MM"
                      maxLength={2}
                      className="!bg-gray-50 dark:!bg-gray-700 !text-gray-900 dark:!text-white !border-gray-300 dark:!border-gray-600 rounded-lg transition-all focus:!border-blue-500 dark:focus:!border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-200">Expiry Year</label>
                    <Input
                      value={paymentData.expiryYear}
                      onChange={(e) =>
                        setPaymentData({ ...paymentData, expiryYear: e.target.value })
                      }
                      placeholder="YY"
                      maxLength={2}
                      className="!bg-gray-50 dark:!bg-gray-700 !text-gray-900 dark:!text-white !border-gray-300 dark:!border-gray-600 rounded-lg transition-all focus:!border-blue-500 dark:focus:!border-blue-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-200">Card Brand</label>
                  <select
                    value={paymentData.cardBrand}
                    onChange={(e) =>
                      setPaymentData({ ...paymentData, cardBrand: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-gray-50 border-gray-300 font-semibold transition-all focus:border-blue-500 dark:focus:border-blue-400"
                  >
                    <option value="">Select Brand</option>
                    <option value="visa">Visa</option>
                    <option value="mastercard">Mastercard</option>
                    <option value="amex">American Express</option>
                    <option value="rupay">RuPay</option>
                  </select>
                </div>
              </>
            )}

            {paymentData.type === 'upi' && (
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-200">UPI ID *</label>
                <Input
                  value={paymentData.upiId}
                  onChange={(e) =>
                    setPaymentData({ ...paymentData, upiId: e.target.value })
                  }
                  placeholder="yourname@upi"
                  className="!bg-gray-50 dark:!bg-gray-700 !text-gray-900 dark:!text-white !border-gray-300 dark:!border-gray-600 rounded-lg transition-all focus:!border-blue-500 dark:focus:!border-blue-400"
                />
              </div>
            )}

            <div className="flex items-center gap-3 bg-purple-50 dark:bg-purple-900/30 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
              <input
                type="checkbox"
                checked={paymentData.isDefault}
                onChange={(e) =>
                  setPaymentData({ ...paymentData, isDefault: e.target.checked })
                }
                className="w-5 h-5 rounded accent-purple-600 dark:accent-purple-400"
              />
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Set as default payment method</label>
            </div>
          </div>
        </Modal>
      </Spin>
    </div>
  );
};

export default UserProfile;
