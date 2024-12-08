import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

enum Direction {
  UP = 0,
  RIGHT = 1,
  DOWN = 2,
  LEFT = 3,
}

interface Coordinate {
  X: number;
  Y: number;
}

enum PositionValue {
  NORMAL,
  OBSTACLE,
  OUTSIDE,
}

@Component({
  standalone: true,
  selector: 'app-root',
  template: `<div>
    <div>
      {{ 'Part 1 - Path length: ' + computePath() }}
    </div>
  </div>`,
  imports: [],
})
export class AppComponent {
  httpClient = inject(HttpClient);

  direction = Direction.UP;

  path = new Map<string, number>();

  // DATA_FILE_PATH = '/assets/6-1-test.txt';
  DATA_FILE_PATH = '/assets/6-1.txt';

  lines = toSignal(
    this.httpClient
      .get(this.DATA_FILE_PATH, { responseType: 'text' })
      .pipe(map((input) => input.split('\n')))
  );

  grid: Signal<Array<Array<string>>> = computed(() => {
    if (!this.lines()) return [[]];
    return this.readGrid(this.lines()!);
  });

  computePath = computed(() => {
    if (this.grid().length > 1) {
      let currentPosition: Coordinate | null = this.findStart();
      this.setPath(currentPosition);
      console.log('this.path', this.path.size);
      console.log('currentPosition', currentPosition);
      while (currentPosition) {
        currentPosition = this.takeAStep(currentPosition);
      }
      console.log('this.path', this.path);
      return this.path.size;
    } else {
      return 0;
    }
  });

  readGrid(lines: Array<string>): Array<Array<string>> {
    const grid = new Array<Array<string>>();
    lines.forEach((line) => {
      grid.push(line.split(''));
    });
    return grid;
  }

  findStart(): Coordinate {
    let startIndex: Coordinate = { X: 0, Y: 0 };
    this.grid().forEach((row, rowIndex) => {
      let cellIndex = row.findIndex((cell) => cell === '^');
      if (cellIndex !== -1) {
        startIndex = { X: cellIndex, Y: rowIndex };
      }
    });
    console.log('startIndex', startIndex);
    return startIndex;
  }

  takeATurn() {
    this.direction = (this.direction + 1) % 4;
  }

  takeAStep(currentPosition: Coordinate): Coordinate | null {
    let stepCandidate: Coordinate;
    switch (this.direction) {
      case Direction.UP:
        stepCandidate = { X: currentPosition.X, Y: currentPosition.Y - 1 };
        break;
      case Direction.RIGHT:
        stepCandidate = { X: currentPosition.X + 1, Y: currentPosition.Y };
        break;
      case Direction.DOWN:
        stepCandidate = { X: currentPosition.X, Y: currentPosition.Y + 1 };
        break;
      case Direction.LEFT:
        stepCandidate = { X: currentPosition.X - 1, Y: currentPosition.Y };
        break;
    }

    const candidatePositionValue = this.getPositionValue(stepCandidate);
    if (candidatePositionValue === PositionValue.NORMAL) {
      currentPosition = stepCandidate;
      this.setPath(currentPosition);
      console.log('currentPosition', currentPosition);
    } else if (candidatePositionValue === PositionValue.OBSTACLE) {
      this.takeATurn();
    } else if (candidatePositionValue === PositionValue.OUTSIDE) {
      return null;
    }
    return currentPosition;
  }

  getPositionValue(position: Coordinate): PositionValue {
    if (
      position.X < 0 ||
      position.Y < 0 ||
      position.X >= this.grid()[0].length ||
      position.Y >= this.grid().length
    ) {
      return PositionValue.OUTSIDE;
    } else if (this.grid()[position.Y][position.X] === '#') {
      return PositionValue.OBSTACLE;
    } else {
      return PositionValue.NORMAL;
    }
  }

  setPath(currentPosition: Coordinate) {
    const entry = `x:${currentPosition.X}, y:${currentPosition.Y}`;
    this.path.set(entry, 1);
  }
}
