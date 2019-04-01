import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { ServiceProvider } from '../../providers/service/service';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the AllUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-all-user',
  templateUrl: 'all-user.html',
})
export class AllUserPage {

  page = 1;  
  maxcount: any;
  users = [];
  feedlist = [];
  user_id: any;
  public pagingEnabled: boolean = true;
  showSearchbar: boolean = false;
  myInput: any;
  searchresult: any;
  imageurl: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private AuthService: AuthProvider,
    public api: ApiProvider,
    private service: ServiceProvider, ) 
    {
    this.user_id = AuthService.getuserid();
    this.userlist(); 
  }


  ionViewDidLoad() 
  {
    console.log('ionViewDidLoad UserListPage');
  }

  
  userlist(infiniteScroll?) 
  {

    this.api.post('UserList', { page: this.page, user_id: this.user_id })
      .subscribe(res => {
        console.log('api res', this.page)
        console.log('res', res)
        this.feedlist = this.feedlist.concat(res['user_list']);
        console.log('UserList')
        console.log(this.feedlist)
        console.log(res);
        this.maxcount = res['max_count'];
        console.log('feedlist', this.feedlist)
        console.log('maxcount userlist', this.maxcount)
        if (infiniteScroll) {
          infiniteScroll.complete();
        }
      })
  }


  doInfinite(infiniteScroll) 
  {
    this.page = this.page + 1;
    if (this.page < this.maxcount) 
    {
      console.log('thispage', this.page);
      console.log('maxcount', this.maxcount)
      console.log('doinfinite')
      console.log(this.feedlist)

      this.userlist(infiniteScroll);
      console.log('EEEEQQQUUUAALLLSSSS', this.page)
      console.log('doinfinite', this.feedlist)
    }
    else 
    {
      console.log('disable')
      infiniteScroll.enable(false);
    }

  }


  follow(id, index) {
    console.log('userid', this.user_id)
    console.log('userid2', id)
    this.api.post('followuser', { followed_by: this.user_id, follower_to: id }).subscribe((response: any) => {
      console.log(response);
      if (response.Ack == 1) 
      {
        console.log('follow')
        console.log('isfollow', this.feedlist[index])
        this.service.popup('', response.msg);
        this.feedlist[index].is_follow = response.followed;
        console.log(this.feedlist[index].is_follow);
      }

      else if (response.Ack == 2) 
      {
        this.service.popup('', 'Please login');
      }
      else 
      {
        this.service.popup('', response.msg);
      }
    }, err => {
      this.service.popup('Alert', 'Something went wrong');
    });
  }


  userprofile(id) 
  {
    console.log('id', id);
    this.navCtrl.push('UserProfilePage', { para: id });
  }


  opensearchbar() 
  {
    this.showSearchbar = !this.showSearchbar;
  }


  onCancel() 
  {
    this.showSearchbar = !this.showSearchbar;
    console.log('cancel');
    this.myInput = '';
  }


  search(data) 
  {
    console.log(this.myInput)
    this.api.post('UserList', { keyword: this.myInput }).subscribe((response: any) => {
      console.log(response);

      if (response.Ack == 1) {
        this.feedlist = response.user_list

      } else {
        this.feedlist = [];

      }
    },
      err => {
        this.service.popup('Alert', 'Something went wrong');
      }
    );
  }

}
