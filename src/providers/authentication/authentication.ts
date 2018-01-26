import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

/*
  Generated class for the AuthenticationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthenticationProvider {

	// PRODUÇÃO
	// private apiUrl = 'http://freitasjonathan08.000webhostapp.com/api/config.php';
	// DESENVOLVIMENTO
  private apiUrl = 'http://localhost/Projetos/domotica_api/config.php';

	private data = { default: null, data: null };

  	constructor(public http: Http) {
    
  	}

  	changePass(data) {
        this.data.default = { key: 'updatePass' };
        this.data.data = data;
        return this.http.post(this.apiUrl, this.data).map(res => res.json());
    }
    register(data) {
        this.data.default = { key: 'setUser' };
        this.data.data = data;
        return this.http.post(this.apiUrl, this.data).map(res => res.json());
    }
    autentifica(data) {
        this.data.default = { key: 'getUser' };
        this.data.data = data;
        return this.http.post(this.apiUrl, this.data).map(res => res.json());
    }
}
