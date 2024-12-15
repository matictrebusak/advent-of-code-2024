import { HttpClient } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `<div>
    <div>
      {{ 'Part 1 - Number of stones: ' + sumOfStones() }}
    </div>
  </div>`,
  imports: [],
})
export class AppComponent {
  httpClient = inject(HttpClient);

  // DATA_FILE_PATH = '/assets/11-1-test.txt';
  DATA_FILE_PATH = '/assets/11-1.txt';

  lines = toSignal(
    this.httpClient
      .get(this.DATA_FILE_PATH, { responseType: 'text' })
      .pipe(map((input) => input.split(' ').map((char) => +char)))
  );

  sumOfStones = computed(() => {
    let stones = this.lines()!;
    if (!stones) return 0;

    const numberOfLoops = 25;
    for (let i = 0; i < numberOfLoops; i++) {
      stones = this.blink(stones);
      console.log('Number of loops: ' + ((i + 1) / 25) * 100 + '%');
    }

    return stones?.length;
  });

  blink(stones: Array<number>): Array<number> {
    stones = stones.flatMap((stone) => {
      const stoneString = stone.toString();
      if (stone === 0) {
        return [1];
      } else if (stoneString.length % 2 === 0) {
        const len = stoneString.length / 2;

        const first = +stoneString.slice(0, len);
        const second = +stoneString.slice(len);
        return [first, second];
      } else {
        return [stone * 2024];
      }
    });
    // console.log('stones', stones);
    return stones;
  }
}
