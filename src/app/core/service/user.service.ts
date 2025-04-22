import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {
  CreateUserRequest,
  RoleResponse,
  User,
} from '../../shared/models/users/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = environment.identityServerUrl + '/api';
  private http = inject(HttpClient);

  getAllUsers() {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  createUser(user: CreateUserRequest) {
    return this.http.post(`${this.baseUrl}/users`, user);
  }

  deleteUser(id: string) {
    const url = `${this.baseUrl}/users/${id}`;
    return this.http.delete(url);
  }

  getAllRoles() {
    return this.http.get<RoleResponse[]>(`${this.baseUrl}/users/roles`);
  }

  toggleLock(userId: string, isLocked: boolean) {
    const url = `${this.baseUrl}/users/${
      isLocked ? 'lock' : 'unlock'
    }/${userId}`;
    return this.http.post(url, {});
  }

  createNewRole(role: string) {
    const url = `${this.baseUrl}/users/roles`;
    return this.http.post(url, { roleName: role });
  }
  deleteRole(name: string) {
    const url = `${this.baseUrl}/users/roles/${name}`;
    return this.http.delete(url);
  }
}
