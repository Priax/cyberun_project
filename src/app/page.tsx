'use client';

import { useState, useEffect } from 'react';
import { JsonForms } from '@jsonforms/react';
import schema from './schemas/schema.json';
import uischema from './schemas/uischema.json';
import initialData from './schemas/data.json';
import { materialRenderers, materialCells } from '@jsonforms/material-renderers';
import PercentageControl from './components/PercentageControl';
import styles from './styles/Home.module.css';

const percentageTester = (uischema: any) => {
  return uischema && uischema.scope && uischema.scope.endsWith('/percentage') ? 1 : -1;
};

const renderers = [
  ...materialRenderers,
  { tester: percentageTester, renderer: PercentageControl },
];

interface Country {
  country: string;
  percentage: number;
}

interface Data {
  countries: Country[];
}

export default function Home() {
  const [data, setData] = useState<Data>(initialData);
  const [error, setError] = useState('');

  useEffect(() => {
    const countries = data.countries || [];

    const countryNames = countries.map(c => c.country);
    const uniqueCountries = new Set(countryNames);
    if (uniqueCountries.size !== countryNames.length) {
      setError('Des pays en double ont été trouvés.');
      return;
    }

    const totalPercentage = countries.reduce((sum, country) => sum + (country.percentage || 0), 0);
    if (totalPercentage > 100) {
      setError('Le total des pourcentages ne peut pas dépasser 100%.');
    } else if (totalPercentage < 100) {
      setError('Le total des pourcentages doit être de 100%.');
    } else {
      setError('');
    }
  }, [data]);

  const handleChange = ({ data }: { data: Data }) => {
    console.log('Nouvelle donnée:', data);
    setData(data);
  };

  return (
    <div className='App'>
      <JsonForms
        schema={schema}
        uischema={uischema}
        data={data}
        renderers={renderers}
        cells={materialCells}
        onChange={handleChange}
      />
      <pre className={styles.jsonText}>
        {JSON.stringify(data, null, 2)}
      </pre>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}
