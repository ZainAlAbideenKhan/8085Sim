let instruction = {
  "MOV": {
    "arguments": 2,
    "hasComma": true,
    "bytes": 1,
    "argType": ["reg", "reg"]
  },
  "MVI": {
    "arguments": 2,
    "hasComma": false,
    "bytes": 2,
    "argType": ["reg", "2BH"]
  },
  "LXI": {
    "arguments": 2,
    "hasComma": true,
    "bytes": 3,
    "argType": ["reg", "4BH"]
  },
  "LDA": {
    "arguments": 1,
    "hasComma": false,
    "bytes": 3,
    "argType": ["4BH"]
  },
  "STA": {
    "arguments": 1,
    "hasComma": false,
    "bytes": 3,
    "argType": ["4BH"]
  },
  "LHLD": {
    "arguments": 1,
    "hasComma": false,
    "bytes": 3,
    "argType": ["4BH"]
  },
  "SHLD": {
    "arguments": 1,
    "hasComma": false,
    "bytes": 3,
    "argType": ["4BH"]
  },
  "LDAX": {
    "arguments": 1,
    "hasComma": false,
    "bytes": 1,
    "argType": ["reg"]
  },
  "STAX": {
    "arguments": 1,
    "hasComma": false,
    "bytes": 1,
    "argType": ["reg"]
  },
  "XCHG": {
    "arguments": 0,
    "hasComma": false,
    "bytes": 1,
    "argType": []
  },
  "ADD": {
    "arguments": 1,
    "hasComma": false,
    "bytes": 1,
    "argType": ["reg"]
  },
  "ADI": {
    "arguments": 1,
    "hasComma": false,
    "bytes": 2,
    "argType": ["2BH"]
  },
  "SUB": {
    "arguments": 1,
    "hasComma": false,
    "bytes": 1,
    "argType": ["reg"]
  },
  "SUI": {
    "arguments": 1,
    "hasComma": false,
    "bytes": 2,
    "argType": ["2BH"]
  },
  "INR": {
    "arguments": 1,
    "hasComma": false,
    "bytes": 1,
    "argType": ["reg"]
  },
  "DCR": {
    "arguments": 1,
    "hasComma": false,
    "bytes": 1,
    "argType": ["reg"]
  },
  "INX": {
    "arguments": 1,
    "hasComma": false,
    "bytes": 1,
    "argType": ["reg"]
  },
  "DCX": {
    "arguments": 1,
    "hasComma": false,
    "bytes": 1,
    "argType": ["reg"]
  },
  "DAD": {
    "arguments": 1,
    "hasComma": false,
    "bytes": 1,
    "argType": ["reg"]
  },
  "CMA": {
    "arguments": 0,
    "hasComma": false,
    "bytes": 1,
    "argType": []
  },
  "CMP": {
    "arguments": 1,
    "hasComma": false,
    "bytes": 1,
    "argType": ["reg"]
  },
  "CPI": {
    "arguments": 1,
    "hasComma": false,
    "bytes": 2,
    "argType": ["2BH"]
  },
  "JMP": {
    "arguments": 1,
    "hasComma": false,
    "bytes": 3,
    "argType": ["4BH"]
  },
  "JC": {
    "arguments": 1,
    "hasComma": false,
    "bytes": 3,
    "argType": ["4BH"]
  },
  "JNC": {
    "arguments": 1,
    "hasComma": false,
    "bytes": 3,
    "argType": ["4BH"]
  },
  "JZ": {
    "arguments": 1,
    "hasComma": false,
    "bytes": 3,
    "argType": ["4BH"]
  },
  "JNZ": {
    "arguments": 1,
    "hasComma": false,
    "bytes": 3,
    "argType": ["4BH"]
  },
  "CALL": {
    "arguments": 1,
    "hasComma": false,
    "bytes": 3,
    "argType": ["4BH"]
  },
  "RET": {
    "arguments": 0,
    "hasComma": false,
    "bytes": 1,
    "argType": []
  },
  "RST": {
    "arguments": 1,
    "hasComma": false,
    "bytes": 1,
    "argType": ["4BH"]
  },
  "PUSH": {
    "arguments": 1,
    "hasComma": false,
    "bytes": 1,
    "argType": ["reg"]
  },
  "POP": {
    "arguments": 1,
    "hasComma": false,
    "bytes": 1,
    "argType": ["reg"]
  },
  "IN": {
    "arguments": 1,
    "hasComma": false,
    "bytes": 2,
    "argType": ["2BH"]
  },
  "OUT": {
    "arguments": 1,
    "hasComma": false,
    "bytes": 2,
    "argType": ["2BH"]
  },
  "HLT": {
    "arguments": 0,
    "hasComma": false,
    "bytes": 1,
    "argType": []
  }
}
export { instruction }