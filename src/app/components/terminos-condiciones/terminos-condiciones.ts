import { Component, model, output } from '@angular/core';

@Component({
  selector: 'app-terminos-condiciones',
  standalone: true,
  imports: [],
  templateUrl: './terminos-condiciones.html',
  styleUrl: './terminos-condiciones.css',
})
export class TerminosCondiciones {
  visible = model<boolean>(false);
  accept = output<void>();

  closeModal() {
    this.visible.set(false);
  }

  acceptTerms() {
    this.accept.emit();
    this.visible.set(false);
  }
}
