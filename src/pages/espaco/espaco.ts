import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { MethodsDefaultProvider } from '../../providers/methods-default/methods-default';
import { ServiceProvider } from '../../providers/service/service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

/**
 * Generated class for the EspacoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-espaco',
  templateUrl: 'espaco.html',
})
export class EspacoPage {

	private espaco: any;

  	constructor(public navCtrl: NavController, 
  				public navParams: NavParams,
				private service: ServiceProvider, 
				private formBuilder: FormBuilder, 
				private viewCtrl: ViewController, 
				private methods: MethodsDefaultProvider) {
  	
  		this.espaco = this.formBuilder.group({
            id: [''],
            id_local: [localStorage.getItem('id_local'), Validators.required],
            nome: ['', Validators.required],
        });
        if (this.navParams.get('id') && this.navParams.get('nome')) {
            this.espaco.controls.id.setValue(this.navParams.get('id'));
            this.espaco.controls.nome.setValue(this.navParams.get('nome'));
        }
  	}

  	save() {
        this.methods.loading("Salvando...");
        if (this.espaco.value.id) {
            this.service.update('espaco', {
                'id': this.espaco.value.id,
                'nome': this.espaco.value.nome
            }).subscribe(function (data) {
                this.methods.loader.dismiss();
                this.methods.message('Espaço salvo!');
                this.viewCtrl.dismiss(data);
            }, function (error) {
                console.log(error);
                this.methods.loader.dismiss();
                this.methods.message("Erro! Por favor tente novamente.");
            });
        }
        else {
            this.service.insert('espaco', {
                'id_local': this.espaco.value.id_local,
                'nome': this.espaco.value.nome
            }).subscribe(function (data) {
                this.methods.loader.dismiss();
                this.methods.message('Espaço salvo!');
                this.viewCtrl.dismiss(data);
            }, function (error) {
                this.methods.loader.dismiss();
                console.log(error);
                this.methods.message("Erro! Por favor tente novamente.");
            });
        }
    }

    fechar() {
        this.viewCtrl.dismiss();
    }

}
