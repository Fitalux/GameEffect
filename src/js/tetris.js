function tetris(){
    const tetrisView = document.querySelector(".tetris__play .view ul");
    const scoreDisplay = document.querySelector(".score__display");

    const line_rows = 20;         //가로
    const line_cols = 12;         //세로
    const blocks = {
        Tmino: [
            [[2, 1], [0, 1], [1, 0], [1, 1]],
            [[1, 2], [0, 1], [1, 0], [1, 1]],
            [[0, 0], [1, 0], [1, 1], [2, 0]],
            [[1, 0], [1, 1], [1, 2], [2, 1]],
        ],
        Imino: [
            [[0, 0], [0, 1], [0, 2], [0, 3]],
            [[0, 0], [1, 0], [2, 0], [3, 0]],
            [[0, 0], [0, 1], [0, 2], [0, 3]],
            [[0, 0], [1, 0], [2, 0], [3, 0]],
        ],
        Omino: [
            [[0, 0], [0, 1], [1, 0], [1, 1]],
            [[0, 0], [0, 1], [1, 0], [1, 1]],
            [[0, 0], [0, 1], [1, 0], [1, 1]],
            [[0, 0], [0, 1], [1, 0], [1, 1]],
        ],
        Zmino: [
            [[0, 0], [1, 0], [1, 1], [2, 1]],
            [[1, 0], [0, 1], [1, 1], [0, 2]],
            [[0, 0], [1, 0], [1, 1], [2, 1]],
            [[1, 0], [0, 1], [1, 1], [0, 2]],
        ],
        Smino: [
            [[1, 0], [2, 0], [0, 1], [1, 1]],
            [[0, 0], [0, 1], [1, 1], [1, 2]],
            [[1, 0], [2, 0], [0, 1], [1, 1]],
            [[0, 0], [0, 1], [1, 1], [1, 2]],
        ],
        Jmino: [
            [[0, 2], [1, 0], [1, 1], [1, 2]],
            [[0, 0], [0, 1], [1, 1], [2, 1]],
            [[0, 0], [1, 0], [0, 1], [0, 2]],
            [[0, 0], [1, 0], [2, 0], [2, 1]],
        ],
        Lmino: [
            [[0, 0], [0, 1], [0, 2], [1, 2]],
            [[0, 0], [1, 0], [2, 0], [0, 1]],
            [[0, 0], [1, 0], [1, 1], [1, 2]],
            [[0, 1], [1, 1], [2, 0], [2, 1]],
        ]
    };
    
    let score = 0;
    let duration = 500;
    let downInterval;
    let tempmovingItem;

    const movingItem = {        //tetris block 정보
        type: "Tmino",
        direction: 0,
        top: 0,
        left: 4,
    };

    //시작
    function init(){
        tempmovingItem = { ...movingItem };

        newLine();          //라인 제작
        generateNewBlock();
        renderBlocks();     //블록 출력
    }

    //라인
    function newLine() {
        for(let i=0; i<line_rows; i++) {
            const li = document.createElement("li");
            const ul = document.createElement("ul");

            for(let j=0; j<line_cols; j++){
                const subli = document.createElement("li");
                ul.prepend(subli);
            }

            li.prepend(ul);
            tetrisView.prepend(li);
        }
    }
    //블록
    function renderBlocks(moveType="") {
        // console.log(movingItem.type);
        // console.log(movingItem.direction);
        // console.log(movingItem.top);
        // console.log(movingItem.left);
        // const type = movingItem.type;
        // const direction = movingItem.direction;
        // const top = movingItem.top;
        // const left = movingItem.left;

        const {type, direction, top, left} = tempmovingItem;
        //console.log(type, direction, top, left);

        const movingBlocks = document.querySelectorAll(".moving");
        movingBlocks.forEach(moving => {
            moving.classList.remove(type, "moving")
        })

        blocks[type][direction].some(block => {
            const x = block[0]+left;
            const y = block[1]+top;

            const target = tetrisView.childNodes[y] ? tetrisView.childNodes[y].childNodes[0].childNodes[x] : null;
            const isAvailable = checkEmpty(target);
            
            if(isAvailable) {
                target.classList.add(type, "moving");
            } else {
                tempmovingItem = { ...movingItem };
                setTimeout(() => {
                    renderBlocks();
                    if(moveType === "top"){
                        seizeBlock();
                    }
                });
                return true;
            }
        });
        movingItem.left = left;
        movingItem.top = top;
        movingItem.direction = direction;
    }

    function seizeBlock() {
        const movingBlocks = document.querySelectorAll(".moving");
        movingBlocks.forEach(moving => {
            moving.classList.remove("moving");
            moving.classList.add("seized");
        });
        checkMatch();
        
    }
    function checkMatch() {
        const childNodes = tetrisView.childNodes;
        const matchedLines = [];

        childNodes.forEach(child => {
            let matched = true;
            child.children[0].childNodes.forEach(li => {
                if(!li.classList.contains("seized")) {
                    matched = false;
                }
            });
            if (matched) {
                child.remove();
                matchedLines.push(child);
                score += 100;
                scoreDisplay.innerText = score;
            }
        });
            //칸이 전부 차면 가득 찬 줄 없애고 새로운 줄 추가
            if (matchedLines.length > 0) {
                matchedLines.forEach(matchedLine => {
                    const ul = document.createElement("ul");
                    for (let i = 0; i < line_cols; i++) {
                      const subli = document.createElement("li");
                      ul.appendChild(subli);
                    }
                    const li = document.createElement("li");
                    li.appendChild(ul);
                    tetrisView.prepend(li);
                  });
                }
        generateNewBlock();
    }
        function generateNewBlock() {
            clearInterval(downInterval);
            downInterval = setInterval(()=>{
                moveBlock("top", 1)
            }, duration);

            const blockArray = Object.entries(blocks);
            const randomIndex = Math.floor(Math.random() * blockArray.length)

            movingItem.type = blockArray[randomIndex][0];
            movingItem.top = 0;
            movingItem.left = 4;
            movingItem.direction = 0;
            tempmovingItem = { ...movingItem };

            renderBlocks();
        }

    function checkEmpty(target) {
        if(!target || target.classList.contains("seized")) {
            return false;
        }
        return true
    }

    //블록 움직이기
    function moveBlock (moveType, amount){
        tempmovingItem[moveType] += amount;
        renderBlocks(moveType);
    }

    //블록 모양 변경(블록 돌리기)
    function changeDirection(){
        const direction = tempmovingItem.direction;
        direction === 3 ? tempmovingItem.direction = 0 : tempmovingItem.direction += 1;
        renderBlocks();
    }
    
    //스페이스바 누를 시 그대로 쭉 드롭
    function dropBlock(){
        clearInterval(downInterval);
        downInterval =  setInterval(() => {
            moveBlock("top", 1)
        }, 10)
    }

    document.addEventListener("keydown", e => {
        switch(e.keyCode){
            case 39:
                moveBlock("left", 1);
                break;
            case 37:
                moveBlock("left", -1);
                break;
            case 40:
                moveBlock("top", 1);
                break;
            case 32:
                dropBlock();
                break;
            case 38:
                changeDirection();
                break;
            default:
                break;
        }  
    })
        init();
}
export default tetris;