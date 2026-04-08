import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private router = inject(Router);

  showLoginRequired(message: string) {
    return Swal.fire({
      html: `
        <div style="font-size: 55px; margin-top: 5px;">🍊</div>
        <div class="swal2-title" style="margin-bottom: 10px;">Sign-in Required</div>
        <div class="swal2-html-container">${message}</div>
      `,
      buttonsStyling: false,
      customClass: {
        confirmButton: 'swal2-confirm',
        cancelButton: 'swal2-cancel',
        popup: 'swal2-popup',
        title: 'swal2-title',
        htmlContainer: 'swal2-html-container'
      },
      showCancelButton: true,
      confirmButtonText: 'Go to Login',
      cancelButtonText: 'Maybe later',
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/loginUser']);
      }
    });
  }

}
