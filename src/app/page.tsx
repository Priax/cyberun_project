'use client';

import React, { useState, useEffect, useCallback } from "react";
import JsonFormWrapper from "./components/JsonFormWrapper";
import { InfoPays } from "./components/types";
import { validateData } from "./components/validator";
import styles from './styles/Home.module.css';
import { BaseValues } from './components/types'

const Home = () => {
  const [baseValues, setBaseValues] = useState<BaseValues>({
    France: 0,
    Allemagne: 0,
    Belgique: 0,
    Inconnu: 0,
  });

  const [data, setData] = useState<{
    countries: InfoPays[];
  }>({
    countries: [{ countries_list: "France", percentage: 0 }],
  });

  const [previousCountries, setPreviousCountries] = useState<string[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);

  const getPercentages = useCallback((baseValues: BaseValues) => {
    const total = Object.values(baseValues).reduce(
      (acc, value) => acc + value,
      0
    );

    if (total === 0) {
      return baseValues;
    } else {
      return Object.fromEntries(
        Object.entries(baseValues).map(([country, value]) => [
          country,
          Number(((value / total) * 100).toFixed(2)),
        ])
      );
    }
  }, []);

  useEffect(() => {
    const currentCountries = data.countries.map(
      (item: InfoPays) => item.countries_list
    );

    if (
      JSON.stringify(previousCountries) !== JSON.stringify(currentCountries)
    ) {
      const newBaseValues = { ...baseValues };

      currentCountries.forEach((country) => {
        if (!previousCountries.includes(country)) {
          newBaseValues[country] = (newBaseValues[country] || 0) + 1;
        }
      });

      previousCountries.forEach((country) => {
        if (!currentCountries.includes(country)) {
          delete newBaseValues[country];
        }
      });

      setBaseValues(newBaseValues);

      const updatedPays = data.countries.map((item: InfoPays) => ({
        ...item,
        percentage: getPercentages(newBaseValues)[item.countries_list] || 0,
      }));

      setData((prevData) => ({
        ...prevData,
        countries: updatedPays,
      }));

      setPreviousCountries(currentCountries);
    }
  }, [data.countries, baseValues, previousCountries, getPercentages]);

  const handleChange = ({ data }: { data: { countries: InfoPays[] } }) => {
    const newData = data;

    const uniqueCountriesMap: { [key: string]: number } = {};

    newData.countries.forEach((item) => {
      if (!uniqueCountriesMap[item.countries_list]) {
        uniqueCountriesMap[item.countries_list] = item.percentage;
      }
    });

    const uniqueCountries = Object.entries(uniqueCountriesMap).map(([country, percentage]) => ({
      countries_list: country,
      percentage,
    }));

    // Validation des données
    const updatedData = { ...newData, countries: uniqueCountries };
    if (validateData(updatedData)) {
      setValidationError(null);
      setData(updatedData);
    } else {
      setValidationError(
        "Erreur de validation : assurez-vous que la somme des pourcentages est de 100% et que vous avez rentré un nom."
      );
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <JsonFormWrapper data={data} handleChange={handleChange} />

      {validationError && <p style={{ color: "red" }}>{validationError}</p>}

      <pre className={styles.jsonText}>{JSON.stringify(data, null, 2)}</pre>
      <pre className={styles.jsonText}>
        Base Values: {JSON.stringify(baseValues, null, 2)}
      </pre>
    </div>
  );
};

export default Home;
