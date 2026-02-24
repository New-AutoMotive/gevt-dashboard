import { query } from "./db";
import { cachedQuery } from "./cache";
import { RegistrationRow, MktShareRow, SCurveRow, TopMakesRow } from "./types";
import { MAKE_MAPPING_DICT } from "./makes";

export async function getCountries(withMakes: boolean): Promise<string[]> {
  const table = withMakes ? "registrations" : "registrations_no_make";
  const key = `countries:${table}`;
  return cachedQuery(key, async () => {
    const rows = await query<{ country: string }>(
      `SELECT DISTINCT country FROM ${table} WHERE country NOT LIKE '%\\_%' ORDER BY country`
    );
    return rows.map((r) => r.country);
  });
}

export async function getRegistrations(
  country: string
): Promise<RegistrationRow[]> {
  const key = `registrations:${country}`;
  return cachedQuery(key, async () => {
    return query<RegistrationRow>(
      `SELECT date, fuelType, SUM(registrations) AS registrations
       FROM registrations_no_make
       WHERE date >= '2018-01-01' AND country = ?
       GROUP BY date, fuelType
       ORDER BY date ASC, fuelType ASC`,
      [country]
    );
  });
}

export async function getNationalMktShare(
  country: string,
  fuelType: string,
  makeLabel: string
): Promise<MktShareRow[]> {
  const makes = MAKE_MAPPING_DICT[makeLabel];
  if (!makes || makes.length === 0) return [];

  const key = `mktshare:${country}:${fuelType}:${makeLabel}`;
  return cachedQuery(key, async () => {
    const placeholders = makes.map(() => "?").join(",");
    return query<MktShareRow>(
      `WITH totalSales AS (
        SELECT date, SUM(registrations) AS total
        FROM registrations_no_make
        WHERE fuelType = ? AND country = ?
        GROUP BY date
      )
      SELECT A.date, SUM(A.registrations) AS partial, B.total AS total
      FROM registrations AS A
      JOIN totalSales AS B ON B.date = A.date
      WHERE A.fuelType = ? AND A.make IN (${placeholders})
        AND A.date >= '2019-01-01' AND A.country = ?
      GROUP BY A.date, B.total
      ORDER BY A.date ASC`,
      [fuelType, country, fuelType, ...makes, country]
    );
  });
}

export async function getSCurveData(
  country: string
): Promise<SCurveRow[]> {
  const key = `scurve:${country}`;
  return cachedQuery(key, async () => {
    if (country === "world") {
      return query<SCurveRow>(`SELECT * FROM world_scurve`);
    }
    return query<SCurveRow>(
      `WITH total_table AS (
        SELECT date, SUM(registrations) AS Total
        FROM registrations_no_make
        WHERE country = ? AND date >= '2018-01-01'
        GROUP BY date
      ),
      BEV_table AS (
        SELECT date, SUM(registrations) AS BEV
        FROM registrations_no_make
        WHERE fuelType = 'BEV' AND date >= '2018-01-01' AND country = ?
        GROUP BY date
      )
      SELECT total_table.date, BEV_table.BEV, total_table.Total
      FROM total_table
      INNER JOIN BEV_table ON BEV_table.date = total_table.date
      ORDER BY date ASC`,
      [country, country]
    );
  });
}

export async function getTopMakes(
  country: string,
  type: "alltime" | "monthly"
): Promise<TopMakesRow[]> {
  const key = `topmakes:${country}:${type}`;
  return cachedQuery(key, async () => {
    if (type === "alltime") {
      return query<TopMakesRow>(
        `WITH TopMakes AS (
          SELECT make
          FROM registrations
          WHERE fuelType = 'BEV' AND country = ?
          GROUP BY make
          ORDER BY SUM(registrations) DESC
          LIMIT 5
        )
        SELECT R.*, 'thick' AS width
        FROM registrations AS R
        INNER JOIN TopMakes AS T ON T.make = R.make
        WHERE R.country = ? AND R.fuelType = 'BEV'`,
        [country, country]
      );
    }
    return query<TopMakesRow>(
      `WITH TopMakes AS (
        SELECT DISTINCT make
        FROM (
          SELECT date, make,
            SUM(CASE WHEN fuelType = 'BEV' THEN registrations ELSE 0 END) AS BEV_sales,
            SUM(registrations) AS total_sales,
            ROW_NUMBER() OVER (
              PARTITION BY date
              ORDER BY SUM(CASE WHEN fuelType = 'BEV' THEN registrations ELSE 0 END) DESC
            ) AS rnk
          FROM registrations
          WHERE country = ?
          GROUP BY date, make
        ) AS ranked
        WHERE rnk <= 5
      )
      SELECT R.*, 'thin' AS width
      FROM registrations AS R
      INNER JOIN TopMakes AS T ON T.make = R.make
      WHERE R.fuelType = 'BEV' AND R.country = ?`,
      [country, country]
    );
  });
}
