import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `<div>
    <div>
      {{ 'Part 1 - Path computeFreeSpace: ' + computeFreeSpaceFirstPart() }}
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
    for (let i = 0; i < characthers.length; i += 2) {
      let index = i / 2;
      let diskMap: number = +characthers[i];
      let freeSpace = +characthers[i + 1];
      let diskMapFormatted = diskMap
        ? new Array<string>(diskMap).fill(index.toString())
        : [];
      let freeSpaceFormatted = freeSpace
        ? new Array<string>(freeSpace).fill('.')
        : [];
      newLine = newLine.concat(diskMapFormatted, freeSpaceFormatted);
    }
    const numberOfDots = newLine.filter((char) => char === '.')?.length;
    const numbersWithoutDots = newLine.filter((char) => char !== '.');
    const numbersToInsert = numbersWithoutDots.reverse().slice(0, numberOfDots);

    const sortedNewLine = newLine.map((char) => {
      if (char === '.' && numbersToInsert?.length > 0) {
        const numberToInsert = numbersToInsert.splice(0, 1)?.[0];
        return numberToInsert;
      } else {
        return char;
      }
    });
    const sum = sortedNewLine
      .slice(0, numbersWithoutDots.length)
      .map((char) => +char)
      .reduce((acc, curr, index) => {
        return acc + curr * index;
      }, 0);

    return sum;
  });

  computeFreeSpaceFirstPart: Signal<number> = computed(() => {
    if (!this.lines()) return 0;
    let newLine: Array<string> = [];
    let characthers = this.lines()!;
    for (let i = 0; i < characthers.length; i += 2) {
      let index = i / 2;
      let diskMap: number = +characthers[i];
      let freeSpace = +characthers[i + 1];
      let diskMapFormatted = diskMap
        ? new Array<string>(diskMap).fill(index.toString())
        : [];
      let freeSpaceFormatted = freeSpace
        ? new Array<string>(freeSpace).fill('.')
        : [];
      newLine = newLine.concat(diskMapFormatted, freeSpaceFormatted);
    }
    const numbersWithoutDots = newLine.filter((char) => char !== '.');
    const numbersToInsert = numbersWithoutDots.reverse();
    for (let i = 0; i < numbersToInsert.length; i++) {
      let lengthOfGroup = 1;
      while (numbersToInsert[i] === numbersToInsert[i + lengthOfGroup]) {
        lengthOfGroup++;
      }
      i = i + lengthOfGroup - 1;

      const indexOfInsertion = newLine.findIndex((_, index) => {
        let canWrite = true;
        for (let j = 0; j < lengthOfGroup; j++) {
          if (newLine[index + j] !== '.') {
            canWrite = false;
          }
        }
        return canWrite;
      });

      const origIndex = newLine?.findIndex(
        (char) => char === numbersToInsert[i]
      );

      if (indexOfInsertion !== -1 && origIndex > indexOfInsertion) {
        for (let k = 0; k < lengthOfGroup; k++) {
          newLine[indexOfInsertion + k] = numbersToInsert[i];
          newLine[origIndex + k] = '.';
        }
      }
    }

    const sum = newLine
      .map((char) => +char)
      .reduce((acc, curr, index) => {
        if (isNaN(curr)) {
          return acc;
        }
        return acc + curr * index;
      }, 0);

    return sum;
  });
}
