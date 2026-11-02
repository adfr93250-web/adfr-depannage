import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";
import { BRAND } from "@/data/brand";

document.documentElement.dataset.brand = BRAND.id;
if (process.env.REACT_APP_THEME) document.documentElement.dataset.theme = process.env.REACT_APP_THEME;
document.querySelectorAll<HTMLLinkElement>('link[rel="icon"], link[rel="apple-touch-icon"]').forEach((l) => { l.href = BRAND.favicon; });

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
