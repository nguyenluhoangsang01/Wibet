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
  let MM = split[0].slice(5, 7);
  const yyyy = split[0].slice(0, 4);

  switch (Number(MM)) {
    case 1:
      MM = "Jan";
      break;
    case 2:
      MM = "Feb";
      break;
    case 3:
      MM = "Mar";
      break;
    case 4:
      MM = "Apr";
      break;
    case 5:
      MM = "May";
      break;
    case 6:
      MM = "Jun";
      break;
    case 7:
      MM = "Jul";
      break;
    case 8:
      MM = "Aug";
      break;
    case 9:
      MM = "Sep";
      break;
    case 10:
      MM = "Oct";
      break;
    case 11:
      MM = "Nov";
      break;
    case 12:
      MM = "Dec";
      break;
    default:
      break;
  }

  return `${MM} ${dd}, ${yyyy} ${HH}:${mm}:${ss}`;
}

export function formatNumber(number) {
  return number.toFixed(2).replaceAll(".00", "");
}

export function sizeInMb(bytes) {
  return `${bytes.toLocaleString("en-US").replaceAll(",", ".")} byte${
    bytes > 1 && "s"
  }`;
}
