import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MethodsDefaultProvider } from '../../providers/methods-default/methods-default';
import { ServiceProvider } from '../../providers/service/service';

/**
 * Generated class for the DispositivoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-dispositivo',
  templateUrl: 'dispositivo.html',
})
export class DispositivoPage {

	private dispositivo: any;

  	constructor(public navCtrl: NavController, 
  				public navParams: NavParams,
  				private formBuilder: FormBuilder,
  				private methods: MethodsDefaultProvider,
  				private service: ServiceProvider,
  				private viewCtrl: ViewController) {

  		this.dispositivo = this.formBuilder.group({
            id: [''],
            nome: ['', Validators.required],
            id_tipo: ['', Validators.required],
            id_espaco: ['', Validators.required]
        });
        if (this.navParams.get('id') && this.navParams.get('nome')) {
            this.dispositivo.controls.id.setValue(this.navParams.get('id'));
            this.dispositivo.controls.nome.setValue(this.navParams.get('nome'));
            this.dispositivo.controls.id_tipo.setValue(this.navParams.get('id_tipo'));
            this.dispositivo.controls.id_espaco.setValue(this.navParams.get('id_espaco'));
        }
        this.findTipos();
  	}
  	findTipos() {
        this.methods.loading('Aguarde...');
        this.service.select('tipo_dispositivo')
            .subscribe(function (data) {
            this.tipos = data;
            this.findEspacos();
        }, function (error) {
            console.log(error);
            this.methods.loader.dismiss();
        });
    }
    ;
    findEspacos() {
        this.service.select('espaco', {
            'where': 'id_local=' + 1
        }).subscribe(function (data) {
            this.espacos = data;
            this.methods.loader.dismiss();
        }, function (error) {
            console.log(error);
            this.methods.loader.dismiss();
        });
    }
    ;
    save() {
        this.methods.loading('Salvando...');
        if (this.dispositivo.value.id) {
            this.service.update('dispositivo', {
                'id': this.dispositivo.value.id,
                'id_tipo': this.dispositivo.value.id_tipo,
                'id_espaco': this.dispositivo.value.id_espaco,
                'nome': this.dispositivo.value.nome
            }).subscribe(function (data) {
                this.methods.loader.dismiss();
                this.methods.message('Dispositivio salvo!');
                this.viewCtrl.dismiss(data);
            }, function (error) {
                console.log(error);
                this.methods.loader.dismiss();
            });
        }
        else {
            this.service.insert('dispositivo', {
                'id_tipo': this.dispositivo.value.id_tipo,
                'id_espaco': this.dispositivo.value.id_espaco,
                'nome': this.dispositivo.value.nome,
                'status': 0
            }).subscribe(function (data) {
                this.methods.loader.dismiss();
                this.methods.message('Dispositivio salvo!');
                this.viewCtrl.dismiss(data);
            }, function (error) {
                console.log(error);
                this.methods.loader.dismiss();
            });
        }
    }
    fechar() {
        this.viewCtrl.dismiss();
    }

}
