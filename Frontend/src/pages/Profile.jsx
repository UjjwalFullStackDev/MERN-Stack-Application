import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import api from '../config/api';
import Input from '../components/Input';
import Button from '../components/Button';
import ImageUpload from '../components/ImageUpload';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
      profileImage: null
    }
  });

  useEffect(() => {
    if (user) {
      setProfileData(user);
      reset({
        name: user.name,
        profileImage: null
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();
      
      formData.append('name', data.name);
      
      if (data.profileImage) {
        formData.append('profileImage', data.profileImage);
      }

      const response = await api.put('/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      updateUser(response.data.user);
      setProfileData(response.data.user);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!profileData) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">Update your personal information</p>
        </div>

        <div className="px-6 py-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <img
                  className="h-24 w-24 rounded-full object-cover border-4 border-gray-200"
                  src={
                    profileData.profileImage
                      ? `http://localhost:5000/uploads/profiles/${profileData.profileImage}`
                      : `https://ui-avatars.com/api/?name=${profileData.name}&background=random&size=96`
                  }
                  alt={`${profileData.name}`}
                />
              </div>
            </div>

            <ImageUpload
              name="profileImage"
              control={control}
              label="Update Profile Picture"
            />

            <div>
              <Input
                name="name"
                control={control}
                label="Name"
                placeholder="Enter your name"
                rules={{
                  required: 'Name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters'
                  }
                }}
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  disabled
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <input
                  type="text"
                  value={profileData.role}
                  disabled
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 capitalize"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                loading={loading}
                size="large"
              >
                Update Profile
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;