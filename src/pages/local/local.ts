import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MethodsDefaultProvider } from '../../providers/methods-default/methods-default';
import { ServiceProvider } from '../../providers/service/service';

/**
 * Generated class for the LocalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  	selector: 'page-local',
  	templateUrl: 'local.html',
})
export class LocalPage {

	private local: any;

  	constructor(public navCtrl: NavController, 
  				public navParams: NavParams,
  				private formBuilder: FormBuilder,
                private methods: MethodsDefaultProvider,
                private service: ServiceProvider) {

  		this.local = this.formBuilder.group({
            id: [localStorage.getItem('id_local')],
            rua: ['', Validators.required],
            numero: ['', Validators.required],
            complemento: [''],
            id_uf: [{ value: 0, disabled: true }, Validators.required],
            id_cidade: [{ value: 0, disabled: true }, Validators.required],
            id_bairro: [''],
            bairro: [{ value: '' }, Validators.required]
        });
        this.findLocal();
  	}
  	findLocal() {
        this.methods.loading('Aguarde...');
        this.service.select('local', {
            'column': 'local.*, bairro.nome as Bairro, cidade.id as Cidade, uf.id as UF',
            'inner': [
                { 'table': 'bairro', 'foreign_key': 'local.id_bairro' },
                { 'table': 'cidade', 'foreign_key': 'bairro.id_cidade' },
                { 'table': 'uf', 'foreign_key': 'cidade.id_uf' }
            ],
            'where': 'local.id=' + localStorage.getItem('id_local')
        }).subscribe(function (data) {
            if (data[0]) {
                this.local.controls.rua.setValue(data[0].rua);
                this.local.controls.numero.setValue(data[0].numero);
                this.local.controls.complemento.setValue(data[0].complemento);
                this.local.controls.id_uf.setValue(data[0].UF);
                this.local.controls.id_cidade.setValue(data[0].Cidade);
                this.local.controls.id_bairro.setValue(data[0].id_bairro);
                this.local.controls.bairro.setValue(data[0].Bairro);
            }
            this.findUF();
            if (this.local.controls.id_cidade) {
                this.findCidade(data[0].UF);
            }
        }, function (error) {
            console.log(error);
            this.methods.loader.dismiss();
        });
    }
    findUF() {
        this.service.select('uf')
            .subscribe(function (data) {
            this.methods.loader.dismiss();
            this.local.controls.id_uf.enable();
            this.ufs = data;
        }, function (error) {
            console.log(error);
            this.methods.loader.dismiss();
        });
    }
    findCidade(id) {
        if (id) {
            this.service.select('cidade', {
                'where': 'id_uf=' + id
            }).subscribe(function (data) {
                this.local.controls.id_cidade.enable();
                this.cidades = data;
            }, function (error) { return console.log(error); });
        }
    }
    save() {
        this.methods.loading('Salvando...');
        if (this.local.value.id) {
            this.service.update('bairro', {
                'id': this.local.value.id_bairro,
                'id_cidade': this.local.value.id_cidade,
                'nome': this.local.value.bairro
            }).subscribe(function (data) {
                this.saveLocal();
            }, function (error) {
                this.methods.loader.dismiss();
                console.log(error);
                this.methods.message("Erro! Por favor tente novamente!");
            });
        }
        else {
            this.service.insert('bairro', {
                'id_cidade': this.local.value.id_bairro,
                'nome': this.local.value.bairro
            }).subscribe(function (data) {
                this.saveLocal();
                this.methods.message("Local salvo!");
            }, function (error) {
                this.methods.loader.dismiss();
                console.log(error);
                this.methods.message("Erro! Por favor tente novamente!");
            });
        }
    }
    saveLocal() {
        var dados = {
            'rua': this.local.value.rua,
            'numero': this.local.value.numero,
            'complemento': this.local.value.complemento,
            'id_bairro': this.local.value.id_bairro
        };
        if (this.local.value.id) {
            dados['id'] = this.local.value.id;
        }
        if (!this.local.value.complemento) {
            dados.complemento = null;
        }
        if (this.local.value.id) {
            this.service.update('local', dados)
                .subscribe(function (data) {
                this.methods.loader.dismiss();
                this.methods.message("Local salvo!");
            }, function (error) {
                this.methods.loader.dismiss();
                console.log(error);
                this.methods.message("Erro! Por favor tente novamente!");
            });
        }
        else {
            this.service.insert('local', dados)
                .subscribe(function (data) {
                this.methods.loader.dismiss();
                this.methods.message("Local salvo!");
            }, function (error) {
                this.methods.loader.dismiss();
                console.log(error);
                this.methods.message("Erro! Por favor tente novamente!");
            });
        }
    }

}
