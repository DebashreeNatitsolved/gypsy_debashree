import { Component } from '@angular/core';
import { NgForm, FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { IonicPage, NavController, NavParams, AlertController, MenuController, LoadingController, Events } from 'ionic-angular';

import { ApiProvider } from '../../providers/api/api';
import { AuthProvider } from '../../providers/auth/auth';
import { ServiceProvider } from '../../providers/service/service';

@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'signup.html'
})
export class SignupPage {
  formData: any = {};
  submitted = false;
  isValidEmail = true;
  passwordmatch = true;
  checkEmailExist = true;
  rForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: ApiProvider,
    private AuthService: AuthProvider,
    public alertCtrl: AlertController,
    private service: ServiceProvider,
    private fb: FormBuilder,
    private builder: FormBuilder,
    private loadingCtrl: LoadingController,
    private events: Events,

  ) {
    events.publish('hideFooter', { isHidden: true });
    this.rForm = fb.group({
      'first_name': [null, Validators.required],
      'last_name': [null, Validators.required],
      'email_address': [null, Validators.required],
      'password': [null, Validators.required],
      'conf_password': [null, Validators.required]
    });
  }



  ionViewWillLeave() {
    this.events.publish('hideFooter', { isHidden: false });
  }



  /*onSignup(form: NgForm) 
  {
    this.submitted = true;

    if (form.valid) {
      // this.userData.signup(this.signup.username);
      // this.navCtrl.push(TabsPage);
    }
  }*/


  public checkEmail(values: Object): void {
    if (values != '') {
      this.isValidEmail = this.validateEmail(values);
    }
  }
  public checkpassword(conpass, frmval) {
    console.log(frmval.password);
    console.log(conpass);
    if (frmval.password == conpass) {
      this.passwordmatch = true;
    }
    else {
      this.passwordmatch = false;
    }
  }
  validateEmail(email_address) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email_address);
  }



  signup(formData) {

    if (!this.rForm.valid) {
      const alert = this.alertCtrl.create({
        title: 'Signup Failed!',
        subTitle: "Please fill all the details.",
        buttons: ['OK']
      });
      alert.present();
    }
    else {
      let loading = this.loadingCtrl.create({
        content: 'Loading Please Wait...',
      });
      loading.present();
      console.log(formData);

      this.api.post('signupuser', formData).subscribe((response: any) => {
        console.log(response);
        if (response.Ack === 1) {
          loading.dismiss();
          this.afloginsuccess(response);
        } else {
          loading.dismiss();
          this.service.popup('Alert', response.msg);
        }
      }, err => {
        loading.dismiss();
        this.service.popup('Alert', 'Already Registered');
      });
    }
  }


  ionViewDidLoad() {
    this.events.publish('hideFooter', { isHidden: true });
  }



  afloginsuccess(response) {
    this.navCtrl.setRoot('LoginPage');
    this.service.popup('Success', 'User successfully created');
  }



  onSignin() {
    this.navCtrl.push("LoginPage");
  }
}
