const memory = [];

function addToMemory(role, content) {
  memory.push({ role, content });
}

function getMemory() {
  return memory;
}

module.exports = {
  addToMemory,
  getMemory,
};
