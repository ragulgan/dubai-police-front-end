import { useEffect, useState } from "react";
import {
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
  Box,
} from "@mui/material";
import { getCookie, hasCookie, setCookie } from "cookies-next";
import LanguageChange from "../../public/LanguageChange.svg"; // assuming it's a ReactComponent
import Image from "next/image"; // if it's an image file
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

const languages = [
  { label: "English", value: "/auto/en" },
  { label: "العربية", value: "/auto/ar" },
  { label: "Español", value: "/auto/es" },    // Spanish
  { label: "Français", value: "/auto/fr" },   // French
  { label: "Deutsch", value: "/auto/de" },    //German  
];

const GoogleTranslate = () => {
  const [selected, setSelected] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    window.googleTranslateElementInit = googleTranslateElementInit;
  }, []);

  // useEffect(() => {
  //   const defaultLang = hasCookie("googtrans") ?  getCookie("googtrans") : "/auto/en";
  //   setSelected(defaultLang || "/auto/en");
  // }, []);
  useEffect(() => {
    const getLangFromCookie = async () => {
      const cookie = hasCookie("googtrans") ? await getCookie("googtrans") : "/auto/en";
      setSelected(cookie || "/auto/en");
    };
    getLangFromCookie();
  }, []);

  const googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement(
      {
        pageLanguage: "auto",
        autoDisplay: false,
        includedLanguages: "en,ar,es,fr,de",
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
      },
      "google_translate_element"
    );
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLangChange = (value: string) => {
    setCookie("googtrans", value);
    setSelected(value);
    handleClose();
    window.location.reload();
  };

  return (
    <>
      {/* Hidden Google Translate Widget */}
      <div
        id="google_translate_element"
        style={{
          width: "0px",
          height: "0px",
          position: "absolute",
          zIndex: -9999,
        }}
      />
 <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center", // or 'flex-end' / 'flex-start' based on layout
      marginBottom:'8px'
    }}
  >
      {/* Icon-based Dropdown */}
       <Tooltip title={'Language Change'} className="notranslate">
      <IconButton onClick={handleClick} className="notranslate">
        <LanguageChange style={{ width: 34, height: 34 , marginRight: 1}} />
        {/* <ExpandMoreIcon style={{ fontSize: 24 }} /> */}
        {/* Or use <Image src={LanguageChange} alt="Lang" width={24} height={24} /> */}
      </IconButton>
</Tooltip>
</Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        className="notranslate"
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.value}
            selected={selected === lang.value}
            onClick={() => handleLangChange(lang.value)}
          >
            {lang.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default GoogleTranslate;
