const body = document.querySelector("body");

const preloaderBlock = document.querySelector("#preloader-block");
const memoryBlock = document.querySelector("#memory-block");
const minesweeperBlock = document.querySelector("#minesweeper-block");
const snakeBlock = document.querySelector("#snake-block");

const snakeBtn = document.querySelector(".snake-btn");
const minesweeperBtn = document.querySelector(".minesweeper-btn");
const memoryBtn = document.querySelector(".memory-btn");

const showBlock = (blockToShow) => {
   body.style.overflow = "auto";
   preloaderBlock.style.display = "none";
   blockToShow.classList.remove("none");
};

snakeBtn.addEventListener("click", function () {
   showBlock(snakeBlock);
});

minesweeperBtn.addEventListener("click", function () {
   showBlock(minesweeperBlock);
});

memoryBtn.addEventListener("click", function () {
   showBlock(memoryBlock);
});
