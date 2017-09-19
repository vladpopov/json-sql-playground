import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-apisender',
  templateUrl: './apisender.component.html',
  styleUrls: ['./apisender.component.css']
})
export class ApisenderComponent implements OnInit {
  public appStatus = 'Ready';
  public loginMsg: string = 'You are not logged in.';

  public url:string = '';
  public password:string = '';
  public username:string = '';
  public api:string = '';

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  data = {
    JScode: '',
    review: '',
    token: '',
    requestObj: ''
  }

  methods = {
    goLogin: () => {
      if (this.url != '' && this.username != '' && this.password != '') {
        this.loginMsg = "I'm trying to enter...";
        this.http.post(`${this.url}/api/meta/account/${this.username}/login`, { password: this.password })
          .subscribe(resp => {
            if (resp['token']) {
              this.data.token = resp['token'];
              this.loginMsg = 'You entered.';
            } else {
              this.loginMsg = 'Login failed!';
            }
          }, (err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
              this.data.review = 'Response error : ' + err.error.message;
              return;
            }
          });
      } else {
        alert('Please, enter all data!');
        return;
      }
    },
    sendRequest: () => {
      if (this.url != '' && this.api) {
        let tempReqObj: any;
        if (this.data.requestObj != '') {
          try {
            tempReqObj = JSON.parse(this.data.requestObj);
          } catch (e) {
            this.data.review = 'Error on your request body : ' + e.toString();
            return;
          }
        } else {
          tempReqObj = {};
        }

        this.appStatus = 'Sending...';
        this.http.post(this.url + this.api, tempReqObj, {
          headers: new HttpHeaders().set('X-HTTP-Method-Override', 'GET').set('Authorization', 'Bearer ' + this.data.token)
        }).subscribe(response => {
          this.appStatus = 'Ready!';
          let review = JSON.stringify(response);
          /* start running a user code */
          try {
            eval(this.data.JScode);
          } catch (error) {
            this.data.review = 'Error in your JS code : ' + error.toString();
            return;
          }
          this.data.review = review;
        }, (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.appStatus = 'Error!';
            this.data.review = 'Response error : ' + err.error.message;
            return;
          }
        });
      } else {
        alert('Please, enter all data!');
        return;
      }
    }
  }
}
