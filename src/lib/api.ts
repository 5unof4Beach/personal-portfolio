/**
 * Helper function to handle API responses
 */
export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
}

/**
 * Generic function to fetch data from API
 */
export async function fetchData<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, options);
    return handleApiResponse<T>(response);
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

/**
 * POST request wrapper
 */
export async function postData<T>(url: string, data: any): Promise<T> {
  return fetchData<T>(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

/**
 * PUT request wrapper
 */
export async function putData<T>(url: string, data: any): Promise<T> {
  return fetchData<T>(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

/**
 * DELETE request wrapper
 */
export async function deleteData<T>(url: string): Promise<T> {
  return fetchData<T>(url, {
    method: 'DELETE',
  });
} 
