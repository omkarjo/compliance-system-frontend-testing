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
    // handel if there is no prefix like +91 or 91 and is like indian  number take indian number as default
    let phoneNumberDefault = value;
    if (
      !phoneNumberDefault.startsWith("+") &&
      !phoneNumberDefault.startsWith("91") &&
      phoneNumberDefault.length === 10
    ) {
      phoneNumberDefault = `+91${phoneNumberDefault}`;
    }

    const phoneNumber = parsePhoneNumber(phoneNumberDefault);
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
};

export function fastapiDateFormatter(dateInput) {
  const date = new Date(dateInput);
  return new Intl.DateTimeFormat("en-CA").format(date);
}

export const serializeDates = (data) => {
  const result = { ...data };
  for (const key in result) {
    if (result[key] instanceof Date && !isNaN(result[key])) {
      result[key] = result[key].toISOString().split("T")[0];
    }
  }
  return result;
};
