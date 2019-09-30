const SHA256 = require("crypto-js/sha256");

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

class Block {
  constructor(timestamp, transactions, previousHash = "") {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.timestamp +
        this.previousHash +
        JSON.stringify(this.transaction) +
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
    this.penddingTransactions = [];
    this.miningReward = 100;
  }

  createGesisBlock() {
    return new Block(Date.now(), "Genesis block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePenddingTransactions(miningRewardAddres) {
    let block = new Block(Date.now(), this.penddingTransactions);
    block.mineBlock(this.difficulty);
    console.log("block succcessfully mined");

    this.chain.push(block);
    this.penddingTransactions = [
      new Transaction(null, miningRewardAddres, this.miningReward)
    ];
  }

  createTransaction(transaction) {
    this.penddingTransactions.push(transaction);
  }

  getBalanceOfAddress(address) {
    let balance = 0;
    for (const block of this.chain) {
      for (const transaction of block.transactions) {
        if (transaction.toAddress == address) {
          balance += transaction.amount;
        }

        if (transaction.fromAddress == address) {
          balance -= transaction.amount;
        }
      }
    }
    return balance;
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

let myBlockchain = new Blockchain();

myBlockchain.createTransaction(new Transaction("addr1", "addr2", 100));
myBlockchain.createTransaction(new Transaction("addr2", "addr1", 50));

console.log("minning...");
myBlockchain.minePenddingTransactions("miner-addr-x");

console.log(
  "balance of miner-addr-x",
  myBlockchain.getBalanceOfAddress("miner-addr-x")
);
/* RECONPENSA NA PROXIMA CRIAÇÃO DO BLOCO  */
console.log("minning...");
myBlockchain.minePenddingTransactions("miner-addr-x");

console.log(
  "balance of miner-addr-x",
  myBlockchain.getBalanceOfAddress("miner-addr-x")
);
