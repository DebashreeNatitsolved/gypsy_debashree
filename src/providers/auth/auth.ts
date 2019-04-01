import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

const apiUrl = "http://138.68.12.41:8007/api/";
const imageurl = "http://138.68.12.41:8007/media/";
const mediaurl = "http://138.68.12.41:8007/";

@Injectable()
export class AuthProvider {

    private subject = new BehaviorSubject({});
    public user$: Observable<{}> = this.subject.asObservable();

    private unreadcount = new BehaviorSubject({});
    public unreadmsg$: Observable<{}> = this.unreadcount.asObservable();

    constructor(
        public http: HttpClient,
    ) {
    }

    initialteunreadmsg(val){
        this.unreadcount.next(val);
    }

    initializeUserData(data) {
        this.subject.next(data);
    }

    login(data: any): Observable<any> {
      console.log(data);
        return this.http.post(apiUrl + 'login-submit', data)
        .do((res: any) => {
            console.log(res);
            if(res.ack === 1) {
                this.subject.next({id: res.id, first_name: res.fname, last_name: res.lname, type: res.user_type,user_image: res.user_image});
            }
        })
        .map(response => {
            return response;
        })
        .catch((err: any) => {
            return Observable.throw(err);
        });
    }

    logout(){
        this.subject.next({});
        localStorage.removeItem("authID");
        localStorage.removeItem("authTYPE");
    }

    getuserid(){
        return localStorage.getItem("authID");
    }

    getopenid()
    {
        return localStorage.getItem("openID"); 
    }

    getremeberme()
    {
        return localStorage.getItem("rememberme"); 
    }


    getlogintype()
    {
        return localStorage.getItem("loginTYPE");  
    }
}
