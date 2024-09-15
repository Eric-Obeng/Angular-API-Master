import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Data } from '../../interfaces/data';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.scss',
})
export class FormsComponent {
  @Input() post?: Data;
  @Output() formSubmit = new EventEmitter<Data>();

  postForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.postForm = this.fb.group({
      title: [this.post?.title || '', [Validators.required]],
      body: [this.post?.body || '', [Validators.required]],
    });
  }

  submit() {
    if (this.postForm.valid) {
      const postData: Data = {
        userId: 1,
        id: this.post?.id || 0,
        title: this.postForm.value.title,
        body: this.postForm.value.body,
      };
      this.formSubmit.emit(postData);
      console.log('post created', postData);
    }
  }
}
