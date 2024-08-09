import { Injectable } from "@angular/core";
import { forkJoin, map, Observable, take,} from "rxjs";
import { HttpClient } from "@angular/common/http";

import { environment } from "../../../../assets/environment/environment";
import { Transaction } from "./transactions.model";
import { UserService } from "../user/user.service";


@Injectable({ providedIn: 'root' })
export class TransactionService {
    url = environment.apiUrl + '/' + 'transactions';
    private idUser: string = "";

    constructor( private http: HttpClient, private userService: UserService ) { 
      this.userService.userDetails.subscribe(res => {
        this.idUser = res.id;
      })
    }

    addTransaction(tr: Transaction): Observable<boolean>{
      tr.info.senderId = this.idUser;
        return this.http.post<boolean>(this.url, tr);
    }
    
    gettransactionsByIdUser(): Observable<Transaction[]> {
        const sentTransactions$ = this.http.get<Transaction[]>(`${this.url}?info.senderId=${this.idUser}`);
        const receivedTransactions$ = this.http.get<Transaction[]>(`${this.url}?info.receiverId=${this.idUser}`)
        .pipe(map(transactions => transactions.filter(transaction => transaction.info.receiverId === this.idUser)));

        return forkJoin([sentTransactions$, receivedTransactions$]).pipe(
          map(([sentTransactions, receivedTransactions]) => {
            let arr = [...sentTransactions, ...receivedTransactions].sort((a, b) => {
                return new Date(b.date).getTime() - new Date(a.date).getTime();
              });
            return arr;
          })
        );
      }
      getJustPartTransactions(nr: number): Observable<Transaction[]> {
        return this.gettransactionsByIdUser().pipe(
          take(1), 
          map(transactions => transactions.slice(0, nr))
        );
      }
}