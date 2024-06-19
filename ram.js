class RAM {
  constructor(size, address_bus_size) {
    this.size = size; // RAM size (in bits)
    this.address_bus_size = address_bus_size; // Adress bus size (in bits)
    this.memory_map = {};
  }
}

export {RAM};