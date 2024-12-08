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
      {{ 'Part 1 - Path length: ' + result }}
    </div>
  </div>`,
  imports: [],
})
export class AppComponent {
  httpClient = inject(HttpClient);

  direction = Direction.UP;

  result = 0;

  path = new Map<string, number>();
  potentitalObstacles = new Map<string, number>();
  pathWithDirection = new Array<string>();

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

  constructor() {
    setTimeout(() => {
      this.computePath();
      console.log('this.path', this.path);

      this.path.forEach((value, key) => {
        let [x, y] = key.split(' ');
        console.log('Replacing', x, y);
        let result = this.computePath(true, {
          X: parseInt(x),
          Y: parseInt(y),
        });
        console.log('result', result);
        if (result === -1) {
          this.potentitalObstacles.set(`${x} ${y}`, 1);
        }
      });
      this.result = this.potentitalObstacles.size;
      console.log('this.potentitalObstacles', this.potentitalObstacles);
    }, 100);
  }

  computePath(ignoreSetPath = false, fakeObstacle?: Coordinate): number {
    if (this.grid().length > 1) {
      let currentPosition: Coordinate | null = this.findStart();
      if (!ignoreSetPath) {
        this.setPath(currentPosition);
      }

      let safety = 20000;
      console.log('fakeObstacle', fakeObstacle);

      while (currentPosition && safety > 0) {
        currentPosition = this.takeAStep(
          currentPosition!,
          ignoreSetPath,
          fakeObstacle
        );
        safety--;
      }
      if (safety === 0) {
        console.log('looped');
        return -1;
      }
      console.log('this.path', this.path);
      return this.path.size;
    } else {
      return 0;
    }
  }

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
    this.direction = Direction.UP;

    return startIndex;
  }

  takeATurn() {
    this.direction = (this.direction + 1) % 4;
  }

  takeAStep(
    currentPosition: Coordinate,
    ignoreSetPath: boolean,
    fakeObstacle?: Coordinate
  ): Coordinate | null {
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

    // console.log('stepCandidate', stepCandidate);
    const candidatePositionValue = this.getPositionValue(
      stepCandidate,
      fakeObstacle
    );
    if (candidatePositionValue === PositionValue.NORMAL) {
      currentPosition = stepCandidate;
      if (!ignoreSetPath) {
        this.setPath(currentPosition);
      }
    } else if (candidatePositionValue === PositionValue.OBSTACLE) {
      this.takeATurn();
    } else if (candidatePositionValue === PositionValue.OUTSIDE) {
      return null;
    }
    return currentPosition;
  }

  getPositionValue(
    position: Coordinate,
    fakeObstacle?: Coordinate
  ): PositionValue {
    if (
      position.X < 0 ||
      position.Y < 0 ||
      position.X >= this.grid()[0].length ||
      position.Y >= this.grid().length
    ) {
      return PositionValue.OUTSIDE;
    } else if (
      this.grid()[position.Y][position.X] === '#' ||
      (fakeObstacle?.X === position.X && fakeObstacle?.Y === position.Y)
    ) {
      return PositionValue.OBSTACLE;
    } else {
      return PositionValue.NORMAL;
    }
  }

  setPath(currentPosition: Coordinate) {
    const entry = `${currentPosition.X} ${currentPosition.Y}`;
    this.path.set(entry, 1);
  }
}
