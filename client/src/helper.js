import { useEffect, useRef } from "react";

export function isValidEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
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

export function formatTime(time) {
  if (!time) return null;

  const split = time?.split("T");

  const HH = Number(split[1].slice(0, 2)) + 7;
  const mm = split[1].slice(3, 5);
  const ss = split[1].slice(6, 8);
  const dd = split[0].slice(8, 10);
  const MM = split[0].slice(5, 7);
  const yyyy = split[0].slice(0, 4);

  return `${HH < 10 ? `0${HH}` : HH}:${mm}:${ss} - ${yyyy}/${
    MM < 10 ? `0${MM}` : MM
  }/${dd < 10 ? `0${dd}` : dd}`;
}
