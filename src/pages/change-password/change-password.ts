import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Events } from 'ionic-angular';
import { NgForm, FormControl, FormBuilder, Validators, FormGroup} from '@angular/forms';
import { ApiProvider } from '../../providers/api/api';
import { AuthProvider } from '../../providers/auth/auth';
import { ServiceProvider } from '../../providers/service/service';
/**
 * Generated class for the ChangePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {
  changeForm: FormGroup;
  user_id:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api:ApiProvider,
    private AuthService: AuthProvider,
    public alertCtrl: AlertController,
    private service: ServiceProvider,
    public events: Events,
    private fb: FormBuilder,
    public loadingCtrl: LoadingController,
  ) {

    this.user_id = AuthService.getuserid();

    this.changeForm = fb.group({           
      'old_password':[null, Validators.required],
      'new_password': [null, Validators.required],
      'conf_password': [null, Validators.required]
    });
  }


  changePassword(data)
  {
    let loading = this.loadingCtrl.create({
      content: 'Loading Please Wait...',
    });
    loading.present();
    data.user_id=this.user_id;
    this.api.post('changepassword',data).subscribe((response : any)  => {    
      console.log(response);
    
      if(response.Ack == 1)
      {
        loading.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Success!',
          subTitle: 'Password change successfully.',
           buttons: ['OK']
         });        
       alert.present();
       this.navCtrl.setRoot('HomePage')
      }
      else
      {
        loading.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Error!',
          subTitle: response.msg,
           buttons: ['OK']
         });
       alert.present();
      }
    }, err => {
      loading.dismiss();
      this.service.popup('Error', 'Login Failed');
    });

  }

  ionViewDidLoad() 
  {
    console.log('ionViewDidLoad ChangePasswordPage');
  }


  ionViewWillEnter()
  {
    this.events.publish('hideFooter', { isHidden: true});
  }

}
