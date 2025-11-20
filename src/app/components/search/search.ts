import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule ,Search as lupa } from "lucide-angular";

@Component({
  selector: 'app-search',
  imports: [FormsModule, LucideAngularModule],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {
  search=lupa
  wordKey = '';
  onSearch() {
    console.log(this.wordKey);
  }
}
