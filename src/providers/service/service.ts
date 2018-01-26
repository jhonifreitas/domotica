import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

/*
  Generated class for the ServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServiceProvider {

	// PRODUÇÃO
	// private apiUrl = 'http://freitasjonathan08.000webhostapp.com/api/config.php';
	// DESENVOLVIMENTO
    private apiUrl = 'http://localhost/Projetos/domotica_api/config.php';

	private data = { default: null, data: null };

  	constructor(public http: Http) {
    
    }

  	select(table, option = null) {
        if (option == null) {
            option = {};
        }
        this.data.default = { 'key': 'select', 'table': table };
        this.data.data = option;
        return this.http.post(this.apiUrl, this.data).map(res => res.json());
  	}
  	insert(table, value = null) {
        if (value == null) {
            value = {};
        }
        this.data.default = { 'key': 'insert', 'table': table };
        this.data.data = value;
        return this.http.post(this.apiUrl, this.data).map(res => res.json());
    }
    update(table, value = null) {
        if (value == null) {
            value = {};
        }
        this.data.default = { 'key': 'update', 'table': table };
        this.data.data = value;
        return this.http.post(this.apiUrl, this.data).map(res => res.json());
    }
    delete(table, value = null) {
        if (value == null) {
            value = {};
        }
        this.data.default = { 'key': 'delete', 'table': table };
        this.data.data = value;
        return this.http.post(this.apiUrl, this.data).map(res => res.json());
    };

}
