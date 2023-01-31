import { useEffect, useRef } from "react";

export function isValidEmail(email) {
  return /^(.*)@(tma)\.com\.vn/.test(email);
}

export function useOutsideClick(callback) {
  const ref = useRef();

  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [callback, ref]);

  return ref;
}

export function capitalize(word) {
  const lower = word?.toLowerCase();
  return word?.charAt(0)?.toUpperCase() + lower?.slice(1);
}

export function formatNumber(number) {
  return number.toFixed(2).replaceAll(".00", "");
}

export function sizeInMb(bytes) {
  return `${bytes.toLocaleString("en-US").replaceAll(",", ".")} byte${
    bytes > 1 && "s"
  }`;
}

export const headers = (accessToken) => ({
  authorization: `Bearer ${accessToken}`,
});

export const headersWithMultipartFormData = (accessToken) => ({
  authorization: `Bearer ${accessToken}`,
  "Content-Type": "multipart/form-data",
});
