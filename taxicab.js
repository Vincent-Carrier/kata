const inspect = require("util").inspect;

const eqArrays = function(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  for (let [i, e] of arr1.entries()) {
    if (e !== arr2[i]) return false;
  }
  return true;
};

const eqObjects = function(obj1, obj2) {
  for (const [k, v] of Object.entries(obj1)) {
    if (Array.isArray(v)) {
      if (eqArrays(v, obj2[k])) {
        continue;
      } else {
        return false;
      }
    }
    if (obj2[k] !== v) return false;
  }
  return true;
};

const assertObjectsEqual = function(actual, expected) {
  const condition = eqObjects(actual, expected);
  if (condition) {
    console.log(
      `✅ Assertion Passed: ${inspect(actual)} === ${inspect(expected)}`
    );
  } else {
    console.log(
      `🛑 Assertion Failed: "${inspect(actual)} !== ${inspect(expected)}"`
    );
  }
};

const chunk = function(arr) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    result.push([arr[i], arr[++i]]);
  }
  return result;
};

const turn = function(position, orientation, dir, blocks) {
  let [i, j] = orientation;
  if (dir === "left") {
    [i, j] = [-j, i];
  } else {
    [i, j] = [j, -i];
  }
  let [x, y] = position;
  [x, y] = [x + i * blocks, y + j * blocks];
  return [
    [x, y],
    [i, j]
  ];
};

const blocksAway = function(directions) {
  let position = [0, 0];
  let orientation = directions[0] === "right" ? [0, 1] : [1, 0];
  chunk(directions).forEach(instruction => {
    const [dir, blocks] = instruction;
    [position, orientation] = turn(position, orientation, dir, blocks);
  });
  return { east: position[0], north: position[1] };
};

assertObjectsEqual(blocksAway(["right", 2, "left", 3, "left", 1]), {
  east: 1,
  north: 3
});

assertObjectsEqual(
  blocksAway([
    "left",
    1,
    "right",
    1,
    "left",
    1,
    "right",
    1,
    "left",
    1,
    "right",
    1
  ]),
  { east: 3, north: 3 }
);

assertObjectsEqual(
  blocksAway(["left", 3, "right", 1, "right", 3, "right", 1]),
  { east: 0, north: 0 }
);
