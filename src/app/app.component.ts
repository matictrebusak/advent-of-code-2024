import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `<div>
    <div>
      {{ 'Part 1 - Path computeFreeSpace: ' + computeFreeSpace }}
    </div>
  </div>`,
  imports: [],
})
export class AppComponent {
  httpClient = inject(HttpClient);

  // DATA_FILE_PATH = '/assets/9-1-test.txt';
  DATA_FILE_PATH = '/assets/9-1.txt';

  lines = toSignal(
    this.httpClient
      .get(this.DATA_FILE_PATH, { responseType: 'text' })
      .pipe(map((input) => input.split('')))
  );

  computeFreeSpace: Signal<number> = computed(() => {
    if (!this.lines()) return 0;
    let newLine: Array<string> = [];
    let characthers = this.lines()!;
    console.log('characthers', characthers);
    console.log('characthers.length', characthers.length);
    for (let i = 0; i < characthers.length; i += 2) {
      let index = i / 2;
      let diskMap: number = +characthers[i];
      let freeSpace = +characthers[i + 1];
      // console.log('diskMap', diskMap);
      // console.log('freeSpace', freeSpace);
      // console.log('index', index);
      let diskMapFormatted = diskMap
        ? new Array<string>(diskMap).fill(index.toString())
        : [];
      let freeSpaceFormatted = freeSpace
        ? new Array<string>(freeSpace).fill('.')
        : [];
      // console.log('diskMapFormatted', diskMapFormatted);
      // console.log('freeSpaceFormatted', freeSpaceFormatted);
      newLine = newLine.concat(diskMapFormatted, freeSpaceFormatted);
    }

    console.log('newLine ', newLine);

    const numberOfDots = newLine.filter((char) => char === '.')?.length;
    console.log('Number of dots', numberOfDots);

    const numbersWithoutDots = newLine.filter((char) => char !== '.');
    console.log('numbersWithoutDots', numbersWithoutDots.length);

    const numbersToInsert = numbersWithoutDots.reverse().slice(0, numberOfDots);
    console.log('Number numbersToInsert', numbersToInsert);

    const sortedNewLine = newLine.map((char) => {
      if (char === '.' && numbersToInsert?.length > 0) {
        const numberToInsert = numbersToInsert.splice(0, 1)?.[0];
        return numberToInsert;
      } else {
        return char;
      }
    });

    console.log('sorted new line', sortedNewLine);

    const sum = sortedNewLine
      .slice(0, numbersWithoutDots.length)
      // .filter((char) => char !== '.')
      .map((char) => {
        const cc = +char;
        if (isNaN(cc)) {
          return 0;
        } else return cc;
      })
      .map((char) => {
        // console.log('char' + char);
        if (isNaN(char)) {
        }
        return char;
      })
      .reduce((acc, curr, index) => {
        // console.log('acc', acc);
        // console.log('curr*index', curr * index);
        if (isNaN(curr)) {
          // console.log('index', index);
        }
        return acc + curr * index;
      }, 0);

    console.log('sum', sum);
    return sum;
  });
}
