import Ajv from "ajv";
import addFormats from "ajv-formats";
import { InfoPays } from "./types";
import schema from "../schemas/schema.json"

const ajv = new Ajv();
addFormats(ajv);

ajv.addKeyword({
  keyword: "percentageSum100",
  type: "object",
  validate: (_: any, data: any) => {
    const uniqueCountries = new Set<string>();

    let total = 0;

    data.countries.forEach((item: InfoPays) => {
      if (!uniqueCountries.has(item.countries_list)) {
        uniqueCountries.add(item.countries_list);
        total += item.percentage;
      }
    });

    return total === 100;
  },
  errors: true,
});

export const validateData = (data: { name: string; countries: InfoPays[] }) => {
  const validate = ajv.compile(schema);

  const valid = validate(data);

  if (!valid) {
    console.log(validate.errors);
    return false;
  }

  const uniqueCountries: { [key: string]: number } = {};

  data.countries.forEach((item: InfoPays) => {
    if (!uniqueCountries[item.countries_list]) {
      uniqueCountries[item.countries_list] = item.percentage;
    } else {
      uniqueCountries[item.countries_list] += item.percentage;
    }
  });

  const totalPercentage = Object.values(uniqueCountries).reduce(
    (sum: number, percentage: number) => sum + percentage,
    0
  );

  if (totalPercentage !== 100) {
    console.error(
      `Erreur : La somme des pourcentages est ${totalPercentage}, elle doit être égale à 100%.`
    );
    return false;
  }

  return true;
};
