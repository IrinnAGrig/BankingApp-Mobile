import { Injectable } from "@angular/core";
import { catchError, map, Observable, of, switchMap} from "rxjs";
import { HttpClient } from "@angular/common/http";

import { Card } from "./card.model";
import { UserService } from "../user/user.service";
import { environment } from "../../../../assets/environment/environment";

@Injectable({ providedIn: 'root' })
export class CardService {
    url = environment.apiUrl + '/' + 'cards';
    private idUser = '';

    constructor( private http: HttpClient, private userService: UserService ) { 
        this.userService.userDetails.subscribe(res => this.idUser = res.id);
    }

    addCard(card: Card): Observable<boolean>{
        card.valute = '$';
        card.balance = Math.floor(Math.random() * (10000 - 1000 + 1)) + 10000;
        return this.http.post<boolean>(this.url, card);
    }
    updateCard(card: Card): Observable<boolean>{
        return this.http.put<boolean>(this.url + '/' + card.id, card);
    }
    getMoneyOnAnArbitraryCard(amount: number): Observable<boolean> {
        return this.getCardsByIdUser().pipe(
            switchMap(res => {
                res[0].balance += amount;
                return this.updateCard(res[0]);
            }),
            map(() => true),
            catchError(() => of(false))
        );
    }

    getCardsByIdUser(): Observable<Card[]>{
        return this.http.get<Card[]>(this.url + '?ownerId=' + this.idUser);
    }
    findCardByNumberAndName(cardNr: string): Observable<Card>{
        return this.http.get<Card>(this.url + '?cardNumber=' + cardNr)
    }
}