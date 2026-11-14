/**
 * Deux sites partagent ce code :
 *  - ADFR (adfr-depannage.fr) : nouveau design, dossier src/redesign
 *  - SOS Dépannage (REACT_APP_BRAND=sos) : design d'origine, src/AppClassic
 * La variable est connue à la compilation : seule l'application de la marque est embarquée.
 */
import type { ComponentType } from "react";

const App: ComponentType = process.env.REACT_APP_BRAND === "sos" ? require("@/AppClassic").default : require("@/redesign/Shell").default;

export default App;
