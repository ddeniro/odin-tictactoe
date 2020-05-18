# Javascript

### Module Pattern & Factory Functions
This was my very first time every using module patterns or factory functions in Javascript in a project. I had done some OOP in my OOP and Data Structures and Algorithms classes, but it was unique to do something like Tic Tac Toe, which I had done as a project in my Web Dev class and remake it using these design patterns. It was satisfying to plan the modules and really think about how they work together.

### Issues and learning

One issue I found after coming back to the code was that I was heavily repeating myself by hardcoding in the results on the board.

Here is an example of the top row condition check:
```js
if (_board[0][0] !== '') {
            if (_board[0][0] === _board[0][1] && _board[0][1] === _board[0][2]) {
                _squares[0][0].classList.add('match');
                _squares[0][1].classList.add('match');
                _squares[0][2].classList.add('match');
                return _board[0][0];
            }
```
After watching [Coding Train](https://www.youtube.com/watch?v=trKjYdBASyQ)'s video on Tic Tac Toe Minimax, I saww he found a much better solution which I've added into my program like so:
```js
const squareComparison = (pos1, pos2, pos3) => {
            return pos1 === pos2 && pos2 === pos3 && pos1 != '';
        }

        //all horizontal possibilities
        for (let i = 0; i < _board.length; i++) {
            if (squareComparison(_board[i][0], _board[i][1], _board[i][2])) {
                return _board[i][0];
            } 
        }
```
The minimax was *punishing*. My code is slightly different from Coding Trains, so it needed a different implementation. It was very close, it just needed a couple of things reversed. Thus I spent a lot of time to understand it, and using the browser's debugging tools. Even for something as small as tic-tac-toe, keeping track of recursion was super hard in the browser than Visual Studio's C++ debugger.



The icons I am using come from [Feather Icons](https://feathericons.com/).