import axios from '@/guards/axiosInstance';
import toast from 'react-hot-toast';

export const getRequest = async (
  url?: string,
  params?: {
    [key: string]: any;
  },
  contentType?: string,
) => {
  const response = await axios({
    method: 'get',
    url: url,
    headers: {
      'Content-Type': contentType || 'application/json',
    },
    params,
  });

  return response.data;
};

export const postRequest = async (
  url: string,
  body?: {
    [key: string]: any;
  },
  contentType?: string,
) => {
  const response = await toast.promise(
    axios({
      method: 'post',
      url: url,
      data: body,
      headers: {
        'Content-Type': contentType || 'application/json',
      },
    }),
    {
      loading: 'saving...',
      success: data => {
        return data.data.message || 'Saved Successfully ';
      },
      error: data => {
        return data.data.message;
      },
    },
  );

  return response.data;
};

export const putRequest = async (
  url: string,
  body?: {
    [key: string]: any;
  },
  contentType?: string,
) => {
  const response = await toast.promise(
    axios({
      method: 'put',
      url: url,
      data: body,
      headers: {
        'Content-Type': contentType || 'application/json',
      },
    }),
    {
      loading: 'editing...',
      success: data => {
        return data.data.message || 'Updated Successfully ';
      },
      error: data => {
        return data.data.message;
      },
    },
  );
  return response.data;
};

export const deleteRequest = async (
  url: string,
  body?: {
    [key: string]: any;
  },
  contentType?: string,
) => {
  const response = await toast.promise(
    axios({
      method: 'delete',
      url: url,
      data: body,
      headers: {
        'Content-Type': contentType || 'application/json',
      },
    }),
    {
      loading: 'deleting...',
      success: data => {
        return data.data.message || 'Deleted Successfully ';
      },
      error: data => {
        return data.data.message;
      },
    },
  );

  return response.data;
};
