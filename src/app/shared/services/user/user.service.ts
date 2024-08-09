import { Injectable } from "@angular/core";
import { ErrorInfo, LoginData, RecentUser, SignUpData, UserDetails } from "./user.model";
import { BehaviorSubject, catchError, EMPTY, from, map, mergeMap, Observable, of, switchMap, take, tap, toArray } from "rxjs";
import { HttpClient } from "@angular/common/http";
import * as CryptoJS from 'crypto-js';
import { Router } from "@angular/router";

import { environment } from "../../../../assets/environment/environment";

@Injectable({ providedIn: 'root' })
export class UserService {
    url = environment.apiUrl + '/' + 'users';
    darkMode = false;

    private _userDetails$: BehaviorSubject<UserDetails> =
        new BehaviorSubject<UserDetails>({} as UserDetails);

    
    constructor( private http: HttpClient, private router: Router) { 
        let mode = localStorage.getItem('dark-mode');
        if(mode){
            this.darkMode = JSON.parse(mode);
        }
    }

    public get userDetails(): Observable<UserDetails> {
        return this._userDetails$.asObservable();
    }
    
    public updateUserDetails(userDetails: UserDetails): void {
        this._userDetails$.next(userDetails);
      }

    signIn(data: LoginData): Observable<UserDetails> {
        return this.http.get<UserDetails>(this.url).pipe(
            map(users => {
                if (Array.isArray(users)) {
                    const matchingUser = users.find(user => user.email === data.email && user.password === this.hashPassword(data.password));
                   
                    if (matchingUser) {
                        this._userDetails$.next(matchingUser);
                        return matchingUser;
                    } else {
                        return null;
                    }
                } else {
                    throw new Error('Datele primite de la server nu sunt de tipul așteptat.');
                }
            })
        );
    }
    signUp(data: SignUpData): Observable<UserDetails> {
        let NewData: UserDetails = {
            id: this.generateUserId(data.email, data.fullName),
            email: data.email,
            image: '',
            phone: data.phone,
            fullName: data.fullName,
            birthDate: "",
            password: this.hashPassword(data.password),
            role: "user",
            language: "en",
            spendingLimit: 0,
            totalBalance: 0,
            historyTransfers: []
        }
        return this.http.post<UserDetails>(this.url, NewData).pipe(tap(() => {
            this._userDetails$.next(NewData);
            return NewData;
        }));
    }

    getUserData(id: string): Observable<UserDetails>{
        return this.http.get<UserDetails>(this.url + '/' + id);
    }   

    changePassword(id: string, oldPassword: string, newPassword: string): Observable<ErrorInfo> {
        return this.http.get<UserDetails>(this.url + '/' + id).pipe(
            switchMap(user => {
                if (this.hashPassword(oldPassword) === user.password) {
                    if (user.password === this.hashPassword(newPassword)) {
                        return of({
                            hasError: true,
                            error: 'match-oldnew-pass'
                        });
                    } else {
                        user.password = this.hashPassword(newPassword);
                        return this.editProfile(user).pipe(
                            map(() => ({
                                hasError: false,
                                error: ''
                            })),
                            catchError(err => of({
                                hasError: true,
                                error: 'failed-update'
                            }))
                        );
                    }
                } else {
                    return of({
                        hasError: true,
                        error: 'pass-incorrect'
                    });
                }
            })
        );
    }
    
    editProfile(userData: UserDetails): Observable<ErrorInfo> {
        return this.http.put<boolean>(this.url + '/' + userData.id, userData).pipe(
            tap(el => {
                localStorage.setItem('userDetails', JSON.stringify(userData));
                this.updateUserDetails(userData);
            }),
            map(() => ({
                hasError: false,
                error: ''
            })),
            catchError(err => of({
                hasError: true,
                error: 'Error updating profile.'
            }))
        );
    }
    
    
    private generateUserId(email: string, name: string): string {
        const data = email + 'BankingApp' + name;
        const hash = CryptoJS.SHA256(data).toString();
        return hash;
    }
    private hashPassword(password: string): string {
        const hash = CryptoJS.SHA256(password).toString();
        return hash;
    }
    logout() {
        localStorage.removeItem('userDetails');
        this.router.navigate(['/sign-in']);
        let user: UserDetails = {
            id: '',
            email: '',
            fullName: 'string',
            password: '',
            role: '',
            image: "",
            phone: "",
            birthDate: "",
            language: "en",
            spendingLimit: 0,
            totalBalance: 0,
            historyTransfers: []
        }
        this._userDetails$.next(user);
    }

    autoLogin() {
        const storedUserDetails = localStorage.getItem('userDetails');
        if (storedUserDetails) {
            const userData = JSON.parse(storedUserDetails);
            this._userDetails$.next(userData);
        } else {
            let user: UserDetails = {
                id: '',
                email: '',
                fullName: 'string',
                password: '',
                role: '',
                image: "",
                phone: "",
                birthDate: "",
                language: "en",
                spendingLimit: 0,
                totalBalance: 0,
                historyTransfers: []
            }
            localStorage.setItem('userDetails', JSON.stringify(user));
            this._userDetails$.next(user);
        }
    }

    getHistoryUsers(): Observable<RecentUser[]> {
        return from(this.userDetails).pipe(
            mergeMap(user => 
                from(user.historyTransfers).pipe(
                    mergeMap(transferId => 
                        this.getUserData(transferId.id).pipe(
                            map(transferUser => this.mapToRecentUser(transferUser, transferId.cardNumber)),
                            catchError(err => {
                                console.error(`Error fetching data for transfer ID ${transferId}:`, err);
                                return EMPTY; 
                            })
                        )
                    )
                )
            ),
            take(3), 
            toArray() 
        );
    }    
    
    private mapToRecentUser(user: UserDetails, cardNumber: string): RecentUser {
        return {
            id: user.id,
            name: user.fullName,
            image: user.image,
            cardNumber: cardNumber
        };
    }
}