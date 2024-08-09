import { Injectable } from "@angular/core";
import { environment } from "../../../../assets/environment/environment";
import { map, Observable, switchMap, take, tap } from "rxjs";
import { HttpClient } from "@angular/common/http";

import { UserService } from "../user/user.service";
import { RequestsModel } from "./requests.model";
import { UserDetails } from "../user/user.model";


@Injectable({ providedIn: 'root' })
export class RequestsService {
    url = environment.apiUrl + '/' + 'requests';
    private idUser: string = "";
    activeRequests = 0;

    constructor( private http: HttpClient, private userService: UserService ) { 
      this.userService.userDetails.subscribe(res => {
        this.idUser = res.id;
      })
    }

    addTransaction(tr: RequestsModel): Observable<boolean> {
        tr.senderId = this.idUser;
    
        return this.http.get<UserDetails>(`${this.userService.url}?phone=${tr.phone}`)
            .pipe(
                switchMap(userDetails => {
                  console.log(userDetails);
                    tr.receiverId = userDetails  ? userDetails.id : 'no';
                    return this.http.post<boolean>(this.url, tr);
                })
            );
    }
    updateRequests(request: RequestsModel): Observable<boolean>{
      return this.http.put<boolean>(`${this.url}/${request.id}`, request);
    }
    
    getRequestsByIdUser(): Observable<RequestsModel[]> {
        return this.http.get<RequestsModel[]>(`${this.url}?senderId=${this.idUser}`).pipe(
          map(data => data.reverse())
        );
      }

    getNumberOpened(): Observable<number> {
      return this.http.get<RequestsModel[]>(`${this.url}?senderId=${this.idUser}`).pipe(
        map(requests => 
          requests.filter(request => request.closed === false).length 
        )
      );
    }
}