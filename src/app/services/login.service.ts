import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from './helper';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http:HttpClient) { }

  public getCurrentUser() {
    return this.http.get(`${baseUrl}/users/current-user`);
  }

  public loginGenerateToken(loginUserDto){
    return this.http.post(`${baseUrl}/auth/loginMethod`,loginUserDto).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if(error.status==400){
      errorMessage='Invalid credentials provided';
    }
    return throwError(errorMessage);
  }

  public loginUser(token) {
    localStorage.setItem("token",token);
    return true;
  }

  public isLoggedIn() {
    let tokenStr=localStorage.getItem("token");
    if(tokenStr==undefined || tokenStr=="" || tokenStr==null) {
      return false;
    }
    else {
      return true;
    }
  }

  public logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("customerId");
    sessionStorage.removeItem("customerName")
    return true;
  }

  public getToken() {
    return localStorage.getItem("token");
  }

  public setUser(user) {
    localStorage.setItem("user",JSON.stringify(user));
  }

  public getUser() {
    let userStr=localStorage.getItem("user");
    if(userStr!=null) {
      return JSON.parse(userStr);
    }
    else {
      this.logout();
      return null;
    }
  }

  public getUserRole() {
    let user=this.getUser();
    return user.roles[0].name;
  }
}
