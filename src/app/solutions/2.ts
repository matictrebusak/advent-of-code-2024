import { HttpClient } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `<div>
    <div>{{ 'Part 1 - Total safe reports: ' + safeReports() }}</div>
  </div>`,
  imports: [],
})
export class AppComponent {
  httpClient = inject(HttpClient);

  // DATA_FILE_PATH = '/assets/2-1-test.txt';
  DATA_FILE_PATH = '/assets/2-1.txt';

  parsedInput = toSignal(
    this.httpClient
      .get(this.DATA_FILE_PATH, { responseType: 'text' })
      .pipe(map((response) => response.split('\n')))
  );

  safeReports = computed(() => {
    return this.parsedInput()
      ?.map((line) => {
        const levels = line.split(' ').map((level) => Number(level));
        // const isIncreasing = this.isLevelSafe(levels);
        // const isDecreasing = this.isLevelSafe(levels.reverse());
        const isIncreasing = this.isLevelSafeOneMistake(levels);
        const isDecreasing = this.isLevelSafeOneMistake(levels.reverse());
        return isIncreasing || isDecreasing;
      })
      .reduce((acc, curr) => acc + (curr ? 1 : 0), 0);
  });

  isLevelSafe(levels: Array<number>): boolean {
    return levels.every((level, index) => {
      if (index === 0) {
        return true;
      } else {
        const diff = level - levels[index - 1];
        return diff >= 1 && diff <= 3;
      }
    });
  }

  isLevelSafeOneMistake(levels: Array<number>): boolean {
    let levelCandidates: Array<Array<number>> = [];
    levels.forEach((_level, index) => {
      const newLevel = [...levels];
      newLevel.splice(index, 1);
      levelCandidates.push(newLevel);
    });
    return !!levelCandidates.find((candidate) => this.isLevelSafe(candidate));
  }
}
