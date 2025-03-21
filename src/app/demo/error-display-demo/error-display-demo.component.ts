import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Severity } from '../../layout/error-container/models/error.types';
import { ErrorDisplayService } from '../../layout/error-container/services/error-display.service';

@Component({
  selector: 'ag-error-display-demo',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './error-display-demo.component.html',
  styleUrl: './error-display-demo.component.scss'
})
export class ErrorDisplayDemoComponent {
  loginForm: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private errorDisplayService: ErrorDisplayService
  ) {}
  
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
    
    // Optional: Watch for value changes to clear errors when user starts typing
    this.loginForm.valueChanges.subscribe(() => {
      if (this.loginForm.dirty) {
        this.errorDisplayService.removeAllNotifications();
      }
    });
  }
  
  displayFormErrors(): void {
    this.errorDisplayService.removeAllNotifications();
    
    const emailControl = this.loginForm.get('email');
    const passwordControl = this.loginForm.get('password');
    
    // Email validation
    if (emailControl?.hasError('required')) {
      this.errorDisplayService.addNotification(
        'Email is required', 
        Severity.Error, 
        'Please enter your email address to continue.',
        'EMAIL001',
        'emailInput'
      );
    } else if (emailControl?.hasError('email')) {
      this.errorDisplayService.addNotification(
        'Invalid email format', 
        Severity.Error, 
        'Please enter a valid email format (example@domain.com).',
        'EMAIL002',
        'emailInput'
      );
    }
    
    // Password validation
    if (passwordControl?.hasError('required')) {
      this.errorDisplayService.addNotification(
        'Password is required', 
        Severity.Error, 
        'Please enter your password to continue.',
        'PWD001',
        'passwordInput'
      );
    } else if (passwordControl?.hasError('minlength')) {
      this.errorDisplayService.addNotification(
        'Password too short', 
        Severity.Warning, 
        'Your password should be at least 8 characters long for better security.',
        'PWD002',
        'passwordInput'
      );
    }
  }
  
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.displayFormErrors();
      return;
    }
    
    // Proceed with login using form values
    console.log('Form submitted with:', this.loginForm.value);
  }
}
