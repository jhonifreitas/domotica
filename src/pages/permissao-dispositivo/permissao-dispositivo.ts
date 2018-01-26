import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

/**
 * Generated class for the PermissaoDispositivoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  	selector: 'page-permissao-dispositivo',
  	templateUrl: 'permissao-dispositivo.html',
})
export class PermissaoDispositivoPage {

	private permissao: any;

  	constructor(public navCtrl: NavController, 
  				public navParams: NavParams,
  				private formBuilder: FormBuilder) {

 		this.permissao = this.formBuilder.group({
            id: [''],
            id_dispositivo: ['', Validators.required],
            grupos: [[]]
        });
        this.permissao.controls.id_dispositivo.setValue(this.navParams.get('id'));
        this.findPermissoes();
 	}
 	findGrupo = function () {
        this.service.select('grupo')
            .subscribe(function (data) {
            if (typeof data != "string") {
                this.grupos = data;
                this.methods.loader.dismiss();
            }
        }, function (error) {
            console.log(error);
            this.methods.loader.dismiss();
        });
    }
    // findPessoas(loading){
    //   this.service.select('pessoas')
    //	 .subscribe( data => {
    //       if(typeof data != "string"){
    //         this.grupos = data;
    //         loading.dismiss();
    //       }
    //    },
    //     error => {
    //       console.log(error);
    //       loading.dismiss();
    //     }
    //   );
    // }
    findPermissoes = function () {
        this.methods.loading('Aguarde...');
        this.service.select('permissao_dispositivo', {
            'where': 'id_dispositivo=' + this.permissao.value.id_dispositivo
        }).subscribe(function (data) {
            if (typeof data != "string") {
                var grupos = [];
                for (let permissao of data) {
                    grupos.push(permissao.id_grupo);
                }
                this.permissao.controls.grupos.setValue(grupos);
            }
            this.findGrupo();
        }, function (error) {
            console.log(error);
            this.methods.loader.dismiss();
        });
    }
    ;
    deletePermissoes = function () {
        this.methods.loading('Salvando...');
        this.service.delete('permissao_dispositivo', {
            'id_dispositivo': this.permissao.value.id_dispositivo
        }).subscribe(function (data) {
            this.save();
        }, function (error) {
            console.log(error);
            this.methods.message('Erro! Por favor tente novamente.');
            this.methods.loader.dismiss();
        });
    }
    save = function () {
        if (this.permissao.value.grupos.length > 0) {
            for (let grupo of this.permissao.value.grupos){
                this.service.insert('permissao_dispositivo', {
                    'id_dispositivo': this.permissao.value.id_dispositivo,
                    'id_grupo': grupo
                }).subscribe(function (data) {
                    this.methods.loader.dismiss();
                }, function (error) {
                    this.methods.loader.dismiss();
                    console.log(error);
                    this.methods.message('Erro! Por favor tente novamente.');
                });
            }
            this.methods.message('Permissão adicionada!');
        }
        else {
            this.methods.loader.dismiss();
            this.methods.message('Permissão removida!');
        }
        this.fechar();
    }
    fechar = function () {
        this.viewCtrl.dismiss();
    }

}
