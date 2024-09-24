export class Game {
    private board: number[][] = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    private score: number = 0;

    constructor(board?: number[][]) {
        if(board) {
            if(board.length !== 4 || board.filter(row => row.length !== 4).length > 0) {
                throw new Error('Board must have 4 rows');
            }
        }
        else {
            this.addRandomNumber();
            this.addRandomNumber();
        }
    }

    private reduceLeft(arr: number[]): number[] {
        if(arr.length !== 4) throw new Error("Array must have length of 4");
        if(arr.filter(x => x !== 0).length === 0) return arr;

        arr = arr.filter(x => x !== 0)

        for(var i = 0; i<arr.length-1; i++) {
            if(arr[i] == arr[i+1]) {
                this.score+=arr[i]*2;
                arr[i] *= 2;
                arr.splice(i+1, 1);
                i--;
            }

        }

        while(arr.length<4) {
            arr.push(0);
        }

        return arr;
    }

    private reduceRight(arr: number[]): number[] {
        arr = arr.reverse();
        arr = this.reduceLeft(arr);
        return arr.reverse();
    }

    getScore(): number {
        return this.score;
    }

    addRandomNumber(): void {
        let emptyCells: {x: number, y: number}[] = [];
        for (let x = 0; x < this.board.length; x++) {
            for (let y = 0; y < this.board[x].length; y++) {
                if (this.board[x][y] === 0) {
                    emptyCells.push({ x, y });
                }
            }
        }
        if (emptyCells.length > 0) {
            let randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.board[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4;
        } else {
            console.log("No available cells")
        }
    }

    getFlatBoard(): number[] {
        return this.board.flat();
    }

    printBoard(): void {
        for(let x = 0; x < this.board.length; x++) {
            console.log(this.board[x]);
        }
    }

    moveUp() {
        for(let colIndex = 0; colIndex < 4; colIndex++) {
            let col = this.board.map(row => row[colIndex])
            col = this.reduceLeft(col);
            for(var row = 0; row<4; row++) {
                this.board[row][colIndex] = col[row];
            }
        }
    }
    moveDown() {
        for(let colIndex = 0; colIndex < 4; colIndex++) {
            let col = this.board.map(row => row[colIndex])
            col = this.reduceRight(col);
            for(var row = 0; row<4; row++) {
                this.board[row][colIndex] = col[row];
            }
        }
    }
    moveLeft() {
        for(let rowIndex = 0; rowIndex < 4; rowIndex++) {
            let row = this.board[rowIndex]
            row = this.reduceLeft(row);
            this.board[rowIndex] = row;
        }
    }
    moveRight() {
        for(let rowIndex = 0; rowIndex < 4; rowIndex++) {
            let row = this.board[rowIndex]
            row = this.reduceRight(row);
            this.board[rowIndex] = row;
        }
    }
    move(direction: "up" | "down" | "left" | "right") {
        const oldBoard = this.board;
        switch(direction) {
            case "up":
                this.moveUp();
                break;
            case "down":
                this.moveDown();
                break;
            case "left":
                this.moveLeft();
                break;
            case "right":
                this.moveRight();
                break;
        }
        if(oldBoard!=this.board) {
            this.addRandomNumber();
            this.printBoard();
        }
    }

    moveAI(confidence: number[]) {
        if(confidence.length !== 4) {
            throw new Error('Confidence must have 4 values');
        }
        const oldBoard = this.board;
        let maxIndex = 0;
        for(let i = 1; i < confidence.length; i++) {
            if(confidence[i] > confidence[maxIndex]) {
                maxIndex = i;
            }
        }
        switch(maxIndex) {
            case 0:
                this.moveUp();
                break;
            case 1:
                this.moveDown();
                break;
            case 2:
                this.moveLeft();
                break;
            case 3:
                this.moveRight();
                break;
        }
        if(oldBoard != this.board) this.addRandomNumber();
    }
}
