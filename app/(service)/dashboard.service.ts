const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface Dashboard {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  template? :string;
  thumbnail: string | null;
  isPublic: boolean;
  isStarred: boolean;
  viewCount: number;
  folderId: string | null;
  ownerId: string;
  lastAccessedAt: string;
  createdAt: string;
  updatedAt: string;
  members?: number;
  folder?: string;
}

class DashboardService {
  // Get all user dashboards
  async getUserDashboards(token: string): Promise<Dashboard[]> {
    const response = await fetch(`${API_URL}/api/dashboards`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboards');
    }

    const data = await response.json();
    return data.dashboards;
  }

  // Create new dashboard
  // ✅ FIX: Added isPublic to the data interface so it matches the UI form
  async createDashboard(token: string, data: { title: string; description?: string; isPublic?: boolean; template?: string }): Promise<Dashboard> {
    const response = await fetch(`${API_URL}/api/dashboards`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create dashboard');
    }

    const result = await response.json();
    return result.dashboard;
  }

  // Get single dashboard
  async getDashboard(token: string, id: string): Promise<Dashboard> {
    const response = await fetch(`${API_URL}/api/dashboards/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard');
    }

    const data = await response.json();
    return data.dashboard;
  }

  // Delete dashboard
  async deleteDashboard(token: string, id: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/dashboards/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete dashboard');
    }
  }
}

export const dashboardService = new DashboardService();