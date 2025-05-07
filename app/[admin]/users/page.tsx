'use client';

import { Table, Input, Button, Tag, Space, Popconfirm, message } from 'antd';
import { useEffect, useState } from 'react';
import { SearchOutlined, StopOutlined, PauseCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import axios, { AxiosError } from 'axios';
import ProtectedAdmin from '@/app/components/ProtectedAdmin';
import { cn } from '@/lib/utils';
import { Sidebar } from '@/app/components/sidebar';

const { Search } = Input;

interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  gender: 'male' | 'female';
  birthDate: string;
  role: 'ADMIN' | 'USER';
  isBanned: boolean;
  suspensionEndDate: string | null;
}

interface UserFromApi {
  id: string;
  fullName: string;
  username: string;
  email: string;
  gender: string;
  birthDate: string;
  role: string;
  isBanned: boolean;
  suspensionEndDate: string | null;
}

const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState<string>('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<UserFromApi[]>('https://store-backend-tb6b.onrender.com/users');
        const transformedUsers: User[] = response.data.map((user) => ({
          ...user,
          gender: user.gender as 'male' | 'female',
          role: user.role as 'ADMIN' | 'USER',
          suspensionEndDate: user.suspensionEndDate ? new Date(user.suspensionEndDate).toISOString() : null,
        }));
        setUsers(transformedUsers);
        setFilteredUsers(transformedUsers);
      } catch (error) {
        const axiosError = error as AxiosError;
        message.error(`Failed to fetch users: ${axiosError.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    const filtered = users.filter((user) =>
      user.fullName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleBan = async (userId: string) => {
    try {
      await axios.post(`https://store-backend-tb6b.onrender.com/users/${userId}/ban`);
      message.success(`User with ID ${userId} has been banned.`);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isBanned: true, suspensionEndDate: null } : user
        )
      );
      setFilteredUsers((prevFiltered) =>
        prevFiltered
          .map((user) =>
            user.id === userId ? { ...user, isBanned: true, suspensionEndDate: null } : user
          )
          .filter((user) =>
            user.fullName.toLowerCase().includes(searchValue.toLowerCase())
          )
      );
    } catch (error) {
      const axiosError = error as AxiosError;
      message.error(`Failed to ban user: ${axiosError.message}`);
    }
  };

  const handleUnban = async (userId: string) => {
    try {
      await axios.post(`https://store-backend-tb6b.onrender.com/users/${userId}/unban`);
      message.success(`User with ID ${userId} has been unbanned.`);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isBanned: false, suspensionEndDate: null } : user
        )
      );
      setFilteredUsers((prevFiltered) =>
        prevFiltered
          .map((user) =>
            user.id === userId ? { ...user, isBanned: false, suspensionEndDate: null } : user
          )
          .filter((user) =>
            user.fullName.toLowerCase().includes(searchValue.toLowerCase())
          )
      );
    } catch (error) {
      const axiosError = error as AxiosError;
      message.error(`Failed to unban user: ${axiosError.message}`);
    }
  };

  const handleSuspend = async (userId: string) => {
    try {
      await axios.post(`https://store-backend-tb6b.onrender.com/users/${userId}/suspend`, { durationInDays: 7 });
      const suspensionEndDate = new Date();
      suspensionEndDate.setDate(suspensionEndDate.getDate() + 7);
      message.warning(`User with ID ${userId} has been suspended.`);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? { ...user, isBanned: false, suspensionEndDate: suspensionEndDate.toISOString() }
            : user
        )
      );
      setFilteredUsers((prevFiltered) =>
        prevFiltered
          .map((user) =>
            user.id === userId
              ? { ...user, isBanned: false, suspensionEndDate: suspensionEndDate.toISOString() }
              : user
          )
          .filter((user) =>
            user.fullName.toLowerCase().includes(searchValue.toLowerCase())
          )
      );
    } catch (error) {
      const axiosError = error as AxiosError;
      message.error(`Failed to suspend user: ${axiosError.message}`);
    }
  };

  const handleUnsuspend = async (userId: string) => {
    try {
      await axios.post(`https://store-backend-tb6b.onrender.com/users/${userId}/unsuspend`);
      message.success(`User with ID ${userId} has been unsuspended.`);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isBanned: false, suspensionEndDate: null } : user
        )
      );
      setFilteredUsers((prevFiltered) =>
        prevFiltered
          .map((user) =>
            user.id === userId ? { ...user, isBanned: false, suspensionEndDate: null } : user
          )
          .filter((user) =>
            user.fullName.toLowerCase().includes(searchValue.toLowerCase())
          )
      );
    } catch (error) {
      const axiosError = error as AxiosError;
      message.error(`Failed to unsuspend user: ${axiosError.message}`);
    }
  };

  const getAccountStatus = (user: User): string => {
    if (user.isBanned) return 'Banned';
    if (user.suspensionEndDate && new Date(user.suspensionEndDate) > new Date()) return 'Suspended';
    return 'Active';
  };

  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
      width: '20%',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      width: '15%',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: '25%',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      width: '15%',
      render: (gender: 'male' | 'female') => (
        <Tag color={gender === 'male' ? 'blue' : 'pink'}>{gender}</Tag>
      ),
    },
    {
      title: 'Birth Date',
      dataIndex: 'birthDate',
      key: 'birthDate',
      width: '15%',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: '15%',
      render: (role: 'ADMIN' | 'USER') => (
        <Tag color={role === 'ADMIN' ? 'gold' : 'green'}>{role}</Tag>
      ),
    },
    {
      title: 'Account Status',
      key: 'accountStatus',
      width: '15%',
      render: (_: unknown, record: User) => {
        const status = getAccountStatus(record);
        return (
          <Tag color={status === 'Banned' ? 'red' : status === 'Suspended' ? 'orange' : 'green'}>
            {status}
          </Tag>
        );
      },
      sorter: (a: User, b: User) => {
        const statusA = getAccountStatus(a);
        const statusB = getAccountStatus(b);
        return statusA.localeCompare(statusB);
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '25%',
      render: (_: unknown, record: User) => {
        const status = getAccountStatus(record);
        return (
          <Space
            size="small"
            direction={window.innerWidth < 768 ? 'vertical' : 'horizontal'}
          >
            {status === 'Banned' ? (
              <Popconfirm
                title="Are you sure you want to unban this user?"
                onConfirm={() => handleUnban(record.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary" icon={<PlayCircleOutlined />} size="small">
                  Unban
                </Button>
              </Popconfirm>
            ) : (
              <Popconfirm
                title="Are you sure you want to ban this user?"
                onConfirm={() => handleBan(record.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button danger icon={<StopOutlined />} size="small">
                  Ban
                </Button>
              </Popconfirm>
            )}
            {status === 'Suspended' ? (
              <Popconfirm
                title="Are you sure you want to unsuspend this user?"
                onConfirm={() => handleUnsuspend(record.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary" icon={<PlayCircleOutlined />} size="small">
                  Unsuspend
                </Button>
              </Popconfirm>
            ) : (
              <Popconfirm
                title="Suspend this user temporarily?"
                onConfirm={() => handleSuspend(record.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button icon={<PauseCircleOutlined />} size="small">
                  Suspend
                </Button>
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <ProtectedAdmin>
      <div className={cn('flex flex-col md:flex-row h-screen w-full')}>
        <Sidebar initialOpen={false} />
        <div className="flex-1 p-4 sm:p-6 overflow-auto">
          <h1 className="text-xl sm:text-2xl font-semibold mb-4">Users Management</h1>
          <Input
            placeholder="Search by name"
            prefix={<SearchOutlined />}
            value={searchValue}
            onChange={handleSearchChange}
            size="large"
            className="mb-4 max-w-full sm:max-w-md"
          />
          <Table
            dataSource={filteredUsers.map((user) => ({ ...user, key: user.id }))}
            columns={columns}
            loading={loading}
            pagination={{ pageSize: 5, responsive: true }}
            bordered
            scroll={{ x: 'max-content' }}
            size="small"
          />
        </div>
      </div>
    </ProtectedAdmin>
  );
};

export default AdminUsersPage;