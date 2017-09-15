import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-apisender',
  templateUrl: './apisender.component.html',
  styleUrls: ['./apisender.component.css']
})
export class ApisenderComponent implements OnInit {
  @ViewChild('loginMsg') loginMsg;
  @ViewChild('appMsg') appMsg;
  
  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  data = {
    url: '',
    login: '',
    password: '',
    api: '',
    JScode: '',
    review: '',
    token: '',
    requestObj: ''
  }

  methods = {
    goLogin: () => {
      if (this.data.url != '' && this.data.login != '' && this.data.password != '') {
        this.loginMsg.nativeElement.textContent = "I'm trying to enter...";
        this.http.post(`${this.data.url}/api/meta/account/${this.data.login}/login`, { password: this.data.password })
          .subscribe(resp => {
            if (resp['token']) {
              this.data.token = resp['token'];
              this.loginMsg.nativeElement.textContent = 'You entered.';
            } else {
              this.loginMsg.nativeElement.textContent = 'Login failed!';
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
      if (this.data.url != '' && this.data.api) {
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

        this.appMsg.nativeElement.textContent = 'Sending...';
        this.http.post(this.data.url + this.data.api, tempReqObj, {
          headers: new HttpHeaders().set('X-HTTP-Method-Override', 'GET').set('Authorization', 'Bearer ' + this.data.token)
        }).subscribe(response => {
          this.appMsg.nativeElement.textContent = 'Ready!';
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
            this.appMsg.nativeElement.textContent = 'Error!';
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
