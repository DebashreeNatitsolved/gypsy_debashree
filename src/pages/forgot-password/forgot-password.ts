import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController,Events } from 'ionic-angular';
import { NgForm, FormControl, FormBuilder, Validators, FormGroup} from '@angular/forms';
import { ApiProvider } from '../../providers/api/api';
import { AuthProvider } from '../../providers/auth/auth';
import { ServiceProvider } from '../../providers/service/service';
/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {
  data: any = {};
  isValidEmail = true;  
  submitted = false;
  rForm: FormGroup;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api:ApiProvider,
    private AuthService: AuthProvider,
    public alertCtrl: AlertController,
    private service: ServiceProvider,
    public events: Events,
    private fb: FormBuilder,
    private loadingCtrl: LoadingController
  ) {
    this.rForm = fb.group({           
      'email_address':[null, Validators.required]      
    });
  }

  public checkEmail(values: Object): void {
    if (values != '' ) {
      this.isValidEmail = this.validateEmail(values);      
     } 
  }
  validateEmail(email_address) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email_address);
  }

  resetPassword(data){
    let loading = this.loadingCtrl.create({
      
      content: 'Loading Please Wait...',
      duration: 3000
    });
    loading.present();
    this.api.post('forget_password',data).subscribe((response : any)  => {
      console.log(response);      
      if(response.Ack == 1)
      {          
        this.service.popup('Alert', 'Please check your email.');
        this.navCtrl.push("LoginPage");
      }else
      {
        this.service.popup('Alert', 'Wrong EmailId');
      }
    }, err => {
      this.service.popup('Alert', 'Error!');
    });

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }

}
