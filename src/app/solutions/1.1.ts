import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `<div>
    <div>{{ result() }}</div>
  </div>`,
  imports: [],
})
export class AppComponent {
  httpClient = inject(HttpClient);

  // DATA_FILE_PATH = '/assets/1-1-test.txt';
  DATA_FILE_PATH = '/assets/1-1.txt';

  result = toSignal(
    this.httpClient.get(this.DATA_FILE_PATH, { responseType: 'text' }).pipe(
      map((response) => response.split('\n')),
      map((lines) => {
        let first: Array<Number> = [];
        let second: Array<any> = [];
        let diff: Array<any> = [];

        lines.forEach((line) => {
          const [a, b] = line.split('   ');
          first.push(Number(a));
          second.push(b);
        });
        first = first.sort();
        second = second.sort();
        first.forEach((value, index) => {
          diff.push(Math.abs(Number(value) - Number(second[index])));
        });
        return diff.reduce((acc, curr) => acc + curr, 0);
      })
    )
  );
}
