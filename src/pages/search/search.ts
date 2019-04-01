import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { AuthProvider } from '../../providers/auth/auth';
import { ServiceProvider } from '../../providers/service/service';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  searchresult: any;
  typeinput: any;
  myInput: any;
  priceValue: any = { lower: 0, upper: 2000 };
  formGroup: FormGroup;
  showSearchbar: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: ApiProvider,
    private AuthService: AuthProvider,
    private service: ServiceProvider,
    private fb: FormBuilder, ) {
    this.formGroup = fb.group({
      'keywords': [null, ''],
      'pricerange': [null, ''],

    });
  }


  toggleSearchbar() 
  {
    this.showSearchbar = !this.showSearchbar;
    this.searchresult = '';
  }


  onCancel(ionchange) 
  {
    this.showSearchbar = !this.showSearchbar;

    console.log('cancel');
    this.searchresult = '';
    this.typeinput = '';
  }


  checkFocus() 
  {
    this.typeinput = '';
    console.log('focus')
    this.api.post('search_keyword', {}).subscribe((response: any) => {
      console.log(response);

      if (response.Ack == 1) {

        this.searchresult = response.results

      } else {
        this.searchresult = '';

      }
    },
      err => {
        this.service.popup('Alert', 'Something went wrong');
      }
    );

  }


  getItems(data) 
  {
    this.searchresult = '';
    console.log(this.myInput)
    this.api.post('search_keyword_after_type', { keywords: this.myInput }).subscribe((response: any) => {
      console.log(response);

      if (response.ACK == 1) 
      {
        this.typeinput = response.products;

      } 
      else 
      {
        this.typeinput = '';

      }
    },
      err => {
        this.service.popup('Alert', 'Something went wrong');
      }
    );
  }



  selected(data) 
  {
    console.log('selected search', data)
    this.myInput = data;
    this.typeinput = '';
  }


  ionViewDidLoad() 
  {
    this.checkFocus();
    console.log('ionViewDidLoad SearchPage');
  }


  search(data) 
  {
    data.min = this.priceValue.lower;
    data.max = this.priceValue.upper;
    console.log('type search', data)
    this.navCtrl.push('SearchResultPage', { parameter: JSON.stringify(data) })
  }

}
