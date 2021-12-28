import Axios, { AxiosInstance } from 'axios';
import { Event } from '../types/Event';
import { User } from '../types/User';
import { Slot } from '../types/Slot';
import { Pagination } from '../types/Pagination';

interface AuthResponse {
  jwt: string;
}

interface PaginateRequest {
  perPage?: number;
  page?: number;
}

interface UserRequest extends PaginateRequest {
  suspended?: boolean;
  vid?: string;
}

interface EventRequest extends PaginateRequest {
  callsign?: string;
  destination?: string;
  operation?: string;
  type?: string;
  slotTime?: string;
  gate?: string;
  owner?: string;
}

const fromObjectToQueryString = (obj: any) => {
  const searchParams = new URLSearchParams();
  Object.keys(obj).forEach(key => searchParams.append(key, obj[key]));
  return searchParams.toString();
};

export class ApiClient {
  private axios: AxiosInstance;

  constructor(baseURL: string) {
    this.axios = Axios.create({
      baseURL,
    });
  }

  async auth(ivaoToken: string) {
    return this.axios.post<AuthResponse>('/auth', { 'ivao-token': ivaoToken }).then(response => response.data);
  }

  async getAuth(token: string): Promise<User> {
    return this.axios
      .get<User>('/auth', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => {
        return {
          ...response.data,
          admin: Boolean(response.data.admin),
          suspended: Boolean(response.data.suspended),
        };
      });
  }

  async getUsers(data: UserRequest, token: string) {
    const queryString = fromObjectToQueryString(data);
    return this.axios
      .get<Pagination<User>>(`/user?${queryString}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => response.data);
  }

  async setUserBlock(user: User, suspended: boolean, token: string) {
    return this.axios.patch<void>(`/user/${user.id}`, { suspended }, { headers: { Authorization: `Bearer ${token}` } }).then(() => {});
  }

  async createEvent(data: Partial<Event>, token: string) {
    return this.axios
      .post<Partial<Event>>('/event', data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {});
  }

  async getEvents(token: string, data?: PaginateRequest) {
    const queryString = fromObjectToQueryString(data);
    return this.axios
      .get<Pagination<Event>>(`/event${queryString}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => response.data);
  }

  async updateEvent(eventId: number, data: Partial<Event>, token: string) {
    return this.axios
      .put<Array<Event>>(`/event/${eventId}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => response.data);
  }

  deleteEvent(event: Event, token: string) {
    return this.axios
      .delete(`/event/${event.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => response.data);
  }

  async getSlotsByEvent(eventId: number, token: string, filter?: PaginateRequest) {
    const queryString = fromObjectToQueryString(filter);
    return this.axios
      .get<Pagination<Slot>>(`/event/${eventId}/slot?${queryString}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => response.data);
  }

  createSlot(eventId: number, data: Partial<Slot>, token: string) {
    return this.axios
      .post(`/event/${eventId}/slot`, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => response.data);
  }

  updateSlot(slotId: number, data: Partial<Slot>, token: string) {
    return this.axios
      .put(`/slot/${slotId}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => response.data);
  }

  deleteSlot(id: number, token: string) {
    return this.axios
      .delete(`/slot/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => response.data);
  }
}
