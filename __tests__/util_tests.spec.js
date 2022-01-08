
import {
  get_nbors,
  get_bfs_info,
  solve_bfs,
  solve_dfs
} from "../src/static/utils/utils.js";


var test_walls = {
  0: new Map([ [8, true], [1, false], [3, true] ]),
  1: new Map([ [7, true], [2, true], [4, false], [0, false] ]),
  2: new Map([ [6, false], [5, false], [1, true] ]),
  3: new Map([ [0, true], [4, true], [6, false], [5, true] ]),
  4: new Map([ [1, false], [5, false], [7, true], [3, true] ]),
  5: new Map([ [2, false], [3, true], [8, true], [4, false] ]),
  6: new Map([ [3, false], [7, false], [2, false] ]),
  7: new Map([ [4, true], [8, false], [1, true], [6, false] ]),
  8: new Map([ [5, true], [0, true], [7, false] ])
};

// test maze in RP2
//  _____ 
// |__   |  
// |  |_____|
//     _____|
//


describe("test get_nbor", () => {
  test("test torus neighbors", () => {
    const output = [14, 3, 6, 1];
    expect(get_nbors(2, 4, 'T2')).toEqual(output);
  });

  test("test proj plane neighbors", () => {
    const output = [18, 24, 1, 22];
    expect(get_nbors(23, 5, 'RP2')).toEqual(output);
  });

  test("test proj plane corner", () => {
    const output = [20, 20,  9, 3];
    expect(get_nbors(4, 5, 'RP2')).toEqual(output);
  });
});

describe("test get_bfs_info", () => {
  test("test 3x3 RP2 info", () => {
    var got = get_bfs_info(4, test_walls, 3, 'RP2'); 
    expect(got[0].dist).toEqual(2);
    expect(got[8].pred).toEqual(7);
  });
});

describe("test solve_bfs", () => {
  test("test 3x3 RP2 bfs solution", () => {
    var { predecessor, explored_order } = solve_bfs(4, 8, 3, 'RP2', test_walls);
    expect(explored_order).toEqual([1, 5, 0, 2, 6, 3, 7, 8]);
    expect(predecessor[0]).toEqual(1);
    expect(predecessor[6]).toEqual(2);
  });
});

describe("test solve_dfs", () => {
  test("test 3x3 RP2 dfs solution", () => {
    var { predecessor, explored_order } = solve_dfs(4, 8, 3, 'RP2', test_walls);
    expect(explored_order).toEqual([4, 5, 2, 6, 7]);
    expect(predecessor[8]).toEqual(7);
  });
});
