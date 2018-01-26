import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MethodsDefaultProvider } from '../../providers/methods-default/methods-default';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  	selector: 'page-login',
  	templateUrl: 'login.html',
})
export class LoginPage {

	group:any;

  	constructor(public navCtrl: NavController, 
  				public navParams: NavParams,
  				private methods: MethodsDefaultProvider,
  				private authService: AuthenticationProvider,
  				private formBuilder: FormBuilder) {
  		this.group = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
  	}

  	login() {
        this.methods.loading('Aguarde...');
        this.authService.autentifica(this.group.value)
            .subscribe(function (data) {
            if (data) {
                // Salva Login Local
                localStorage.setItem('id', data.id);
                localStorage.setItem('id_local', data.id_local);
                localStorage.setItem('admin', data.admin);
                localStorage.setItem('username', data.username);
                localStorage.setItem('password', data.password);
                this.events.publish('login');
            }
            else {
                this.methods.message('Usuário ou Senha Inválidos!');
            }
            this.methods.loader.dismiss();
        }, function (error) {
            this.methods.loader.dismiss();
            console.log(error);
        });
    }
}
