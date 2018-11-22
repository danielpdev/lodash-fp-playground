import _ from "lodash";
import fp from "lodash-fp";
const { get, map } = fp;
const { flow } = _;

let address = {
  street: "someStreet"
};
let user = {
  fistName: "John",
  childrens: [
    {
      fistName: "One"
    },
    {
      fistName: "Two"
    },
    {
      fistName: "Tree"
    }
  ],
  address: get("street")
};

const data = [
  { id: 1, name: "Name 0" },
  {
    id: 2,
    type: "group",
    name: "Name A",
    childrens: [
      {
        id: 3,
        type: "group",
        name: "Name B",
        childrens: [
          {
            id: 4,
            type: "group",
            name: "Name C",
            childrens: [
              {
                id: 5,
                type: "group",
                name: "Name D",
                childrens: [
                  {
                    id: 6,
                    type: "item",
                    name: "Name E"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

const operations = [];
const levelizeIterator = childrensProperty => levelProperty => (
  level = 0
) => item => {
  return item.reduce((builder, object) => {
    object[levelProperty] = level;
    builder.push(object);

    if (object[childrensProperty]) {
      builder = builder.concat(
        levelizeIterator(childrensProperty)(levelProperty)(level + 1)(
          object[childrensProperty]
        )
      );
    }
    return builder;
  }, []);
};

const itemsLevelizer = levelizeIterator("childrens")("levelNumber");
operations.push(itemsLevelizer());

const stringifyItem = item =>
  `${"&nbsp; 	&nbsp;".repeat(item.levelNumber)}[${item.id}] ${item.name} ${
    item.type === "group" ? "(+)" : ""
  }<br/>`;

const printItems = value => {
  const logItem = stringifyItem;
  return value.map(logItem).join("");
};
operations.push(printItems);
const executer = flow(...operations);
executer(data);

//make currying functions
const lettersData = ["a", "b", "c"];
const toUpperCase = x => x.toUpperCase();
const toLowerCase = x => x.toLowerCase();
const customMap = fn => arr => arr.map(fn);

const result = customMap(toUpperCase)(lettersData);
console.log(result);
console.log(
  flow(
    customMap(toUpperCase),
    customMap(toLowerCase)
  )(lettersData)
);

console.log(
  customMap(
    flow(
      toUpperCase,
      toLowerCase
    )
  )(lettersData)
);

//get data from api
const request = url => fetch(url);
const toJson = data => data.json();
const pluck = property => object => object[property];
request("https://randomuser.me/api/")
  .then(toJson)
  .then(
    flow(
      pluck("results"),
      pluck(0)
    )
  )
  /* not optimised*/
  // .then(pluck("results"))
  // .then(pluck(0))
  .then(
    flow(
      get("name"),
      name => `${get("title")(name)} ${get("first")(name)}`,
      console.log
    )
  )
  .then(console.log);
document.getElementById("app").innerHTML = `
  Calling -> ${user.address(address)}<br/>
  Mapping -> ${map(get("fistName"))(user.childrens)}<br/>
  Executer -> <br/> ${executer(data)}
`;
