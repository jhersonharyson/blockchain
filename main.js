const SHA256 = require("crypto-js/sha256");
class Block {
  constructor(index, timestamp, data, previousHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }
  calculateHash() {
    return SHA256(
      this.index +
        this.timestamp +
        this.previousHash +
        JSON.stringify(this.data) +
        this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== new Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log("block mined " + this.hash);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGesisBlock()];
    this.difficulty = 2;
  }

  createGesisBlock() {
    return new Block(0, Date.now(), "Genesis block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }
  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];
      if (currentBlock.hash != currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash != previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

/* TESTE INSERINDO BLOCOS E VERIFICANDO ITNEGRIDADE */

// let myBlockchain = new Blockchain();

// myBlockchain.addBlock(new Block(0, Date.now(), { ammount: 4 }));
// myBlockchain.addBlock(new Block(1, Date.now(), { ammount: 50 }));

// console.log(JSON.stringify(myBlockchain.chain, null, 4));

// console.log("is blockchain valid ? " + myBlockchain.isChainValid());

// myBlockchain.chain[1].data = { amount: 100 };
// myBlockchain.chain[1].hash = myBlockchain.chain[1].calculateHash();

// console.log("is blockchain valid ? " + myBlockchain.isChainValid())

/* -------------------------------------------------------------------- */

/* TESTE PROVA DE TRABALHO DIFICULDADE = 2 */

let myBlockchain = new Blockchain();

console.log("mining block 1");
myBlockchain.addBlock(new Block(0, Date.now(), { ammount: 4 }));
console.log("mining block 2");
myBlockchain.addBlock(new Block(1, Date.now(), { ammount: 50 }));
