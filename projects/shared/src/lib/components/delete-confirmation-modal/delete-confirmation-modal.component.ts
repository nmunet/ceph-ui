import { Component, Inject, OnInit, Optional, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormControl, AbstractControl, ValidationErrors, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { SubmitButtonComponent } from '../submit-button/submit-button.component';
import { BaseModal, CheckboxModule, InputModule, ModalModule } from 'carbon-components-angular';
import { CdValidators } from '../../forms/cd-validators';
import { DeleteConfirmationBodyContext } from '~/models/delete-confirmation.model';
import { DeletionImpact } from '~/enum/delete-confirmation-modal-impact.enum';
import { CdFormGroup } from '~/forms';
import { CommonModule } from '@angular/common';
import { AlertPanelComponent } from '../alert-panel/alert-panel.component';
import { FormButtonPanelComponent } from '../form-button-panel/form-button-panel.component';

@Component({
  selector: 'cd-deletion-modal',
  templateUrl: './delete-confirmation-modal.component.html',
  styleUrls: ['./delete-confirmation-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, ModalModule, FormsModule, ReactiveFormsModule, AlertPanelComponent, CheckboxModule, InputModule, FormButtonPanelComponent]

})
export class DeleteConfirmationModalComponent extends BaseModal implements OnInit {
  @ViewChild(SubmitButtonComponent, { static: true })
  submitButton: SubmitButtonComponent;
  deletionForm: CdFormGroup;
  impactEnum = DeletionImpact;
  childFormGroup: CdFormGroup;
  childFormGroupTemplate: TemplateRef<any>;
  submitDisabled$: Observable<boolean> = of(false);
  constructor(
    @Optional() @Inject('impact') public impact: DeletionImpact,
    @Optional() @Inject('itemDescription') public itemDescription: 'entry',
    @Optional() @Inject('itemNames') public itemNames: string[],
    @Optional() @Inject('actionDescription') public actionDescription = 'delete',
    @Optional() @Inject('submitAction') public submitAction?: Function,
    @Optional() @Inject('backAction') public backAction?: Function,
    @Optional() @Inject('bodyTemplate') public bodyTemplate?: TemplateRef<any>,
    @Optional() @Inject('subHeading') public subHeading?: string,
    @Optional()
    @Inject('bodyContext')
    public bodyContext?: DeleteConfirmationBodyContext,
    @Optional() @Inject('infoMessage') public infoMessage?: string,
    @Optional()
    @Inject('submitActionObservable')
    public submitActionObservable?: () => Observable<any>,
    @Optional()
    @Inject('callBackAtionObservable')
    public callBackAtionObservable?: () => Observable<any>,
    @Optional() @Inject('hideDefaultWarning') public hideDefaultWarning?: boolean
  ) {
    super();
    this.actionDescription = actionDescription || 'delete';
    this.impact = this.impact || DeletionImpact.medium;
  }

  ngOnInit() {
    const controls: { [key: string]: AbstractControl } = {
      impact: new UntypedFormControl(this.impact),
      confirmation: new UntypedFormControl(false, {
        validators: [
          CdValidators.composeIf(
            {
              impact: DeletionImpact.medium
            },
            [Validators.requiredTrue]
          )
        ]
      }),
      confirmInput: new UntypedFormControl('', {
        validators: [
          CdValidators.composeIf({ impact: this.impactEnum.high }, [
            this.matchResourceName.bind(this),
            Validators.required
          ])
        ]
      })
    };

    if (this.childFormGroup) {
      controls['child'] = this.childFormGroup;
    }
    this.deletionForm = new CdFormGroup(controls);
    if (!(this.submitAction || this.submitActionObservable)) {
      throw new Error('No submit action defined');
    }
    if (this.bodyContext?.disableForm) {
      this.toggleFormControls(this.bodyContext?.disableForm);
      return;
    }

    if (this.impact === this.impactEnum.high && this.itemNames?.[0]) {
      const target = String(this.itemNames[0]);
      const confirmControl = this.deletionForm.controls.confirmInput;

      this.submitDisabled$ = confirmControl.valueChanges.pipe(
        startWith(confirmControl.value),
        map((value: string) => value !== target)
      );
    }
  }

  matchResourceName(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    if (this.itemNames && control.value !== String(this.itemNames?.[0])) {
      return { matchResource: true };
    }
    return null;
  }

  callSubmitAction() {
    if (this.submitActionObservable) {
      this.submitActionObservable().subscribe({
        error: this.stopLoadingSpinner.bind(this),
        complete: this.hideModal.bind(this)
      });
    } else {
      this.submitAction();
    }
  }

  callBackAction() {
    if (this.callBackAtionObservable) {
      this.callBackAtionObservable().subscribe({
        error: this.stopLoadingSpinner.bind(this),
        complete: this.hideModal.bind(this)
      });
    } else {
      this.backAction();
    }
  }

  hideModal() {
    this.closeModal();
  }

  stopLoadingSpinner() {
    this.deletionForm.setErrors({ cdSubmitButton: true });
  }

  toggleFormControls(disableForm = false) {
    if (disableForm) {
      this.deletionForm.disable();
      this.deletionForm.setErrors({ disabledByContext: true });
      this.submitDisabled$ = of(true);
    } else {
      this.deletionForm.enable();
      this.deletionForm.setErrors(null);
    }
  }
}
