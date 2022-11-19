import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map, Observable, startWith, tap } from 'rxjs';
import { ComplexFormService } from '../../services/complex-form.service';
import { confirmEqualValidator } from '../../validators/confirm-equal.validator';

@Component({
  selector: 'app-complex-form',
  templateUrl: './complex-form.component.html',
  styleUrls: ['./complex-form.component.scss']
})

export class ComplexFormComponent implements OnInit {

  isLoad = false;
  mainForm!: FormGroup;
  personalInfoForm!: FormGroup;
  contactPreferenceCtr!: FormControl;
  emialCtr!: FormControl;
  confirmEmailCtr!: FormControl;
  emailForm!: FormGroup;
  phoneCtr!: FormControl;
  paswordCtr!: FormControl;
  confirmPasswordCtr!: FormControl;
  loginInfoFrom!: FormGroup;

  showEmailCtrl$!: Observable<boolean>;
  showPhoneCtrl$!: Observable<boolean>;

  constructor(private formBuilder: FormBuilder,
              private complexFormService: ComplexFormService) { }

  ngOnInit(): void {
    this.initFormControls();
    this.initMainForm();
    this.initFormObservable();
  }

  private initFormControls():void{
    this.personalInfoForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lasttName: ['', Validators.required]
    });
    this.contactPreferenceCtr = this.formBuilder.control('email');
    this.emialCtr = this.formBuilder.control('');
    this.confirmEmailCtr = this.formBuilder.control('');
    this.emailForm = this.formBuilder.group({
      email: this.emialCtr,
      confirm: this.confirmEmailCtr,
    }, {
      Validators:[confirmEqualValidator('email', 'confirm')]
    });
    this.phoneCtr = this.formBuilder.control('');
    this.paswordCtr = this.formBuilder.control('', Validators.required);
    this.confirmPasswordCtr = this.formBuilder.control('', Validators.required);
    this.loginInfoFrom = this.formBuilder.group({
      userName: ['', Validators.required],
      password: this.paswordCtr,
      confirmPassword: this.confirmPasswordCtr,
    }, {
      Validators: [confirmEqualValidator('password', 'confirmPassword')]
    })
  }

  private initMainForm(): void{
    this.mainForm = this.formBuilder.group({
      personalInfo: this.personalInfoForm,
      contactPreference: this.contactPreferenceCtr,
      email: this.emailForm,
      phone: this.phoneCtr,
      loginInfo: this.loginInfoFrom
    });
  }

  private initFormObservable() {
    this.showEmailCtrl$ = this.contactPreferenceCtr.valueChanges.pipe(
      startWith(this.contactPreferenceCtr.value),
      map(prefernce => prefernce === 'email'),
      tap(showEmailCtrl => this.setEmailValidators(showEmailCtrl))
    );
    this.showPhoneCtrl$ = this.contactPreferenceCtr.valueChanges.pipe(
      startWith(this.contactPreferenceCtr.value),
      map(preference => preference === 'phone'),
      tap(showPhoneCtrl => this.setPhoneValidators(showPhoneCtrl))
    );
  }

  setEmailValidators(showEmailCtrl: boolean){
    if (showEmailCtrl) {
      this.emialCtr.addValidators([Validators.required, Validators.email]);
      this.confirmEmailCtr.addValidators([Validators.required, Validators.email]);
    }else{
      this.emialCtr.clearValidators();
      this.confirmEmailCtr.clearValidators();
    }
    this.emialCtr.updateValueAndValidity();
    this.confirmEmailCtr.updateValueAndValidity();
  }

  setPhoneValidators(showPhoneCtrl: boolean){
    if(showPhoneCtrl){
      this.phoneCtr.addValidators([Validators.required, Validators.minLength(9), Validators.maxLength(9)]);
    }else{
      this.phoneCtr.clearValidators();
    }
    this.phoneCtr.updateValueAndValidity();
  }

  getFormCtrlErrorText(ctrl: AbstractControl){
    if (ctrl.hasError('required')) {
      return 'Ce champ est requis';
  } else if (ctrl.hasError('email')) {
      return 'Merci d\'entrer une adresse mail valide';
  } else if (ctrl.hasError('minlength')) {
      return 'Ce numéro de téléphone ne contient pas assez de chiffres';
  } else if (ctrl.hasError('maxlength')) {
      return 'Ce numéro de téléphone contient trop de chiffres';
  } else {
      return 'Ce champ contient une erreur';
  }
  }

  onSubmitForm() {
    this.isLoad = true;
    this.complexFormService.saveUserInfo(this.mainForm.value).pipe(
      tap(saved => {
        this.isLoad = false;
        if (saved) {
          this.mainForm.reset();
          this.contactPreferenceCtr.patchValue('email');
        }else{
          console.log('échec de l\'enregistrement !');
        }
      })
    ).subscribe();
  }
  

}
