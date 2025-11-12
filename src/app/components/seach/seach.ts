import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-seach',
  imports: [FormsModule],
  templateUrl: './seach.html',
  styleUrl: './seach.css',
})
export class Seach {
  wordKey = '';
  onSearch() {
    console.log(this.wordKey);
  }
}
