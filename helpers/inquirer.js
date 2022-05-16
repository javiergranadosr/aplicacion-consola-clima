const inquirer = require("inquirer");
const colors = require("colors");

const questions = [
  {
    type: "list",
    name: "option",
    message: "¿Qué desea hacer?",
    choices: [
      {
        value: 1,
        name: `${"1".green}. Buscar ciudad`,
      },
      {
        value: 2,
        name: `${"2".green}. Historial`,
      },
      {
        value: 0,
        name: `${"0".green}. Salir`,
      },
    ],
  },
];

const inquireMenu = async () => {
  console.clear();
  console.log("============================".green);
  console.log(" Seleccione una opción ".white);
  console.log("============================'\n".green);

  const { option } = await inquirer.prompt(questions);
  return option;
};

const pause = async () => {
  console.log("\n");
  await inquirer.prompt([
    {
      type: "input",
      name: "pause",
      message: `\nPresione ${"ENTER".green} para continuar\n`,
    },
  ]);
};

const readInput = async (message) => {
  const question = [
    {
      type: "input",
      name: "desc",
      message,
      validate(value) {
        if (value.length === 0) {
          return "Por favor ingrese un valor";
        }
        return true;
      },
    },
  ];

  const { desc } = await inquirer.prompt(question);
  return desc;
};

const listPlaces = async (places = []) => {
  const choices = places.map((place, i) => {
    return {
      value: place.id,
      name: `${colors.green(i + 1 + ".")} ${colors.white(place.name)}`,
    };
  });

  choices.unshift({
    value: '0',
    name: `${'0.'.green} Cancelar`
  });

  const question = [
    {
      type: "list",
      name: "id",
      message: "Seleccione lugar",
      choices,
    },
  ];

  const { id } = await inquirer.prompt(question);
  return id;
};

module.exports = {
  inquireMenu,
  pause,
  readInput,
  listPlaces
};
