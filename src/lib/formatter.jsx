import { countries } from "country-data-list";
import { CircleFlag } from "react-circle-flags";
import { parsePhoneNumber } from "react-phone-number-input";

export const currencyFormatter = (value, currency = "INR") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(value);
};

export const getPhoneDetails = (value) => {
  try {
    const phoneNumber = parsePhoneNumber(value);
    if (!phoneNumber) return { formatted: null, country: null, flag: null };

    const countryCode = phoneNumber.country;
    const country = Object.values(countries).find(
      (c) => c.alpha2 === countryCode,
    );

    return {
      formatted: phoneNumber.formatInternational(),
      countryName: country ? country.name : "Unknown",
      flag: country ? (
        <CircleFlag
          countryCode={country.alpha2.toLowerCase()}
          style={{ width: 24, height: 24 }}
        />
      ) : null,
    };
  } catch (error) {
    return { formatted: "Invalid Number", countryName: "Unknown", flag: null };
  }
};

export function getCountryDetails(alpha3Code) {
  const country = Object.values(countries).find(
    (c) => c.alpha3 === alpha3Code.toUpperCase(),
  );

  if (!country) return { name: "Unknown", flag: null };

  return {
    name: country.name,
    flag: (
      <CircleFlag
        countryCode={country.alpha2.toLowerCase()}
        style={{ width: 24, height: 24 }}
      />
    ),
  };
}


export const formatDate = (date, options) => {
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return null; // Invalid date
  return dateObj.toLocaleDateString("en-IN", options);
}


export function fastapiDateFormatter(dateInput) {
  const date = new Date(dateInput);
  return new Intl.DateTimeFormat('en-CA').format(date);
}